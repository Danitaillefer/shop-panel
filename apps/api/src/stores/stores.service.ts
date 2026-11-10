import { BadGatewayException, BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';

const SHOP_DOMAIN_REGEX = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

@Injectable()
export class StoresService {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly crypto: CryptoService 
    ) { }


    normalizeShopDomain(input: string): string {
        const nameDomain = input.trim().toLowerCase();
        const domain = nameDomain.endsWith('.myshopify.com') ? nameDomain : nameDomain + '.myshopify.com';
        if (!SHOP_DOMAIN_REGEX.test(domain)) {
            throw new BadRequestException('Dominio de tienda no válido');
        }
        return domain;
    }

    buildInstallUrl(shop: string, state: string): string {
        const params = new URLSearchParams({
            client_id: this.config.getOrThrow<string>('SHOPIFY_CLIENT_ID'),
            scope: this.config.getOrThrow<string>('SHOPIFY_SCOPES'),
            redirect_uri: this.config.getOrThrow<string>('SHOPIFY_REDIRECT_URI'),
            state,
        })
        return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
    }
    verifyHmac(query: Record<string, string>): void {
        const { hmac, signature: _signature, ...params } = query;
        if (!hmac) {
            throw new UnauthorizedException('Falta la firma de Shopify');
        }

        const message = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join('&');

        const expected = createHmac('sha256', this.config.getOrThrow<string>('SHOPIFY_CLIENT_SECRET'))
            .update(message)
            .digest('hex');

        const received = Buffer.from(hmac, 'utf8');
        const computed = Buffer.from(expected, 'utf8');
        if (received.length !== computed.length || !timingSafeEqual(received, computed)) {
            throw new UnauthorizedException('Firma de Shopify no válida');
        }
    }

    async exchangeCodeForToken(shop: string, code: string): Promise<{ accessToken: string; scopes: string }> {
        const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: this.config.getOrThrow<string>('SHOPIFY_CLIENT_ID'),
                client_secret: this.config.getOrThrow<string>('SHOPIFY_CLIENT_SECRET'),
                code,
            }),
        });

        if (!response.ok) {
            throw new BadGatewayException('Shopify no aceptó el código de autorización');
        }

        const data = (await response.json()) as { access_token: string; scope: string };
        return { accessToken: data.access_token, scopes: data.scope };
    }

    async saveStore(userId: string, shop: string, accessToken: string, scopes: string){
        const existing = await this.prisma.store.findUnique({where: { shopDomain: shop },});

        if(existing && existing.userId !== userId){
            throw new ConflictException('Esta tienda ya está conecatada a otra cuenta');
        }

        const accessTokenEncrypted = this.crypto.encrypt(accessToken);
        return this.prisma.store.upsert({
            where: {shopDomain: shop},
            update: { accessTokenEncrypted, scopes },
            create: { shopDomain: shop, accessTokenEncrypted, scopes, userId },
        })
    }
}
