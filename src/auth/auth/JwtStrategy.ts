import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Constants } from 'src/utils/constants';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { findOne } from 'src/utils/functions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    const user = await findOne(
      this.prisma,
      Constants.user,
      Constants.userId,
      payload?.userId,
    );
    if (user && user.token === payload?.token) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
