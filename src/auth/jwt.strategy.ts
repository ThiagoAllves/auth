import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ← agora usa Authorization: Bearer
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'secreta-super-segura',
    });
  }

  async validate(payload: { userId: number; email: string }) {
    // O objeto retornado aqui estará disponível em req.user
    return { userId: payload.userId, email: payload.email };
  }
}