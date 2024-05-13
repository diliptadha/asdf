import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth/auth.service';
import { DocumentService } from 'src/document/document.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    UserService,
    PrismaService,
    AuthService,
    PrismaService,
    DocumentService,
  ],
})
export class UserModule {}
