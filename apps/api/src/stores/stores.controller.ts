import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { randomBytes } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StoresService } from './stores.service';

const STATE_COOKIE = 'shopify_oauth_state';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

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
}