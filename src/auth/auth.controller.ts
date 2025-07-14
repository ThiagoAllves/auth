import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalStrategy)
  @Post('login')
  async login(@Request() req) {
    
    return this.authService.login(req.body);
  }
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    return this.authService.register({
      email: body.email,
      password: hashedPassword,
    });
  }
}