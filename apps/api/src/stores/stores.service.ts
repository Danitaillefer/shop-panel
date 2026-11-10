import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const SHOP_DOMAIN_REGEX = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

@Injectable()
export class StoresService {
    constructor(private readonly config: ConfigService){}

    
    normalizeShopDomain(input: string): string{
        const nameDomain = input.trim().toLowerCase();
        const domain = nameDomain.endsWith('.myshopify.com') ? nameDomain : nameDomain + '.myshopify.com';
        if (!SHOP_DOMAIN_REGEX.test(domain)){
            throw new BadRequestException('Dominio de tienda no válido');
        }
        return domain;
    }
    
    buildInstallUrl(shop: string, state: string): string{
        const params = new URLSearchParams({
            client_id: this.config.getOrThrow<string>('SHOPIFY_CLIENT_ID'),
            scope: this.config.getOrThrow<string>('SHOPIFY_SCOPES'),
            redirect_uri: this.config.getOrThrow<string>('SHOPIFY_REDIRECT_URI'),
            state,
        })
        return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
    }
}
