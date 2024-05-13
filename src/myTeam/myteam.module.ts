import { Module } from '@nestjs/common';
import { MyteamService } from './myteam.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from 'src/auth/auth/JwtStrategy';

@Module({
  imports: [AuthModule, HttpModule],
  providers: [MyteamService, PrismaService, JwtStrategy],
})
export class MyteamModule {}
