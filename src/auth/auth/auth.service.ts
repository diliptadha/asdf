import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { Constants } from 'src/utils/constants';
import { findOne } from 'src/utils/functions';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/user/dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await findOne(
      this.prisma,
      Constants.user,
      Constants.emailId,
      loginDto.emailId,
    );
    if (!user) {
      throw new HttpException(Constants.invalid, HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new HttpException(Constants.invalid, HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.generateAccessToken(user);

    return {
      userData: user,
      access_token: accessToken,
    };
  }

  private generateAccessToken(user: any): string {
    const payload = {
      userId: user.userId,
      emailId: user.emailId,
    };
    try {
      const tokenGenerate = this.jwtService.sign(payload, {});
      return tokenGenerate;
    } catch (err) {
      return err;
    }
  }
}
