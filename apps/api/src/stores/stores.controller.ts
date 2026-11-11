import { Controller, Get, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { randomBytes } from 'crypto';
import { type AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StoresService } from './stores.service';

const STATE_COOKIE = 'shopify_oauth_state';

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) { }

    @Get('connect')
    @UseGuards(JwtAuthGuard)
    connect(@Query('shop') shopInput: string, @Res() res: Response) {
        const shop = this.storesService.normalizeShopDomain(shopInput ?? '');
        const state = randomBytes(16).toString('hex');

        res.cookie(STATE_COOKIE, state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000,
        });

        res.redirect(this.storesService.buildInstallUrl(shop, state));
    }

    @Get('callback')
    @UseGuards(JwtAuthGuard)
    async callback(
        @Query() query: Record<string, string>,
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
    ) {
        const expectedState: string | undefined = req.cookies?.[STATE_COOKIE];
        res.clearCookie(STATE_COOKIE, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });

        if (!expectedState || query.state !== expectedState) {
            throw new UnauthorizedException('El estado de la conexión no es válido');
        }

        this.storesService.verifyHmac(query);
        const shop = this.storesService.normalizeShopDomain(query.shop ?? '');
        const { accessToken, scopes } = await this.storesService.exchangeCodeForToken(shop, query.code);
        await this.storesService.saveStore(req.user.id, shop, accessToken, scopes);

        res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/`);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findMine(@Req() req: AuthenticatedRequest){
        return this.storesService.findByUser(req.user.id)
    }
}