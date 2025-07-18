import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    // Retorna um objeto sem a senha
    const { password: _, ...result } = user;
    return result;
  }

  async login(user) {
    const dbUser = await this.validateUser(user.email, user.password);
    
    const payload = { sub: user.password, email: user.email, userId: dbUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(data: { email: string; password: string }) {
  return this.usersService.create(data);
}
}