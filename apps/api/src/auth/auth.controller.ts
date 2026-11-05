import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import * as jwtAuthGuard from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({passthrough:true}) res: Response,
  ){
    const { token, user } = await this.authService.login(dto);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return user;
  }

  @Get('me')
  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  me(@Req() req: jwtAuthGuard.AuthenticatedRequest){
    return this.authService.me(req.user.id)
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({passthrough:true}) res: Response){
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    return { message: 'Sesión cerrada'}
  }
}
