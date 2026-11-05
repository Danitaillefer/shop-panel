import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from 'express';

export interface JwtPayload {
    sub: string
}

export interface AuthenticatedRequest extends Request {
    user: {id: string};
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const token : string | undefined = request.cookies?.access_token;

        if (!token){
            throw new UnauthorizedException('No has iniciado sesión');
        }

        try{
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
            request.user = { id: payload.sub }
            return true;
        }catch{
            throw new UnauthorizedException('Sesión no válida o caducada')
        }
    }
}