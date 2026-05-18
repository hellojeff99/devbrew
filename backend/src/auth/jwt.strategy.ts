import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type JwtPayload = {
  sub: number;
  role: string;
  name: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      // secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }
}
