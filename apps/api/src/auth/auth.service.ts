import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }
  private toPublicUser(user: User) {
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
  }
  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException('El email ya está registrado');
    }
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      email,
      passwordHash,
      name: dto.name,
    });
    return this.toPublicUser(user);
  }
  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email)
    if (!user){
      throw new ConflictException('Credenciales Incorrectas')
    }
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid){
      throw new ConflictException('Credenciales Incorrectas')
    }
    const token = await this.jwtService.signAsync({ sub: user.id });
    return { token, user: this.toPublicUser(user) };
  }

  async me(userId: string){
    const user = await this.usersService.findById(userId);
    if (!user){
      throw new UnauthorizedException()
    }
    return this.toPublicUser(user);
  }
}
