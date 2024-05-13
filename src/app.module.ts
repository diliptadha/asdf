import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplyAsEngineerController } from './apply-as-engineer/applyasengineer.controller';
import { ApplyAsEngineerModule } from './apply-as-engineer/applyasengineer.module';
import { ApplyAsEngineerService } from './apply-as-engineer/applyasengineer.service';
import { AuthMiddleware } from './auth/auth/auth.middleware';
import { AuthModule } from './auth/auth/auth.module';
import { AuthService } from './auth/auth/auth.service';
import { ClientdashboardController } from './clientdashboard/clientdashboard.controller';
import { ClientdashboardModule } from './clientdashboard/clientdashboard.module';
import { ClientdashboardService } from './clientdashboard/clientdashboard.service';
import { DevdashboardController } from './devdashboard/devdashboard.controller';
import { DevdashboardModule } from './devdashboard/devdashboard.module';
import { DevdashboardService } from './devdashboard/devdashboard.service';
import { DocumentController } from './document/document.controller';
import { DocumentModule } from './document/document.module';
import { DocumentService } from './document/document.service';
import { EmailCronService } from './email-cron.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { HiretopengineerController } from './hiretopengineer/hiretopengineer.controller';
import { HiretopengineerModule } from './hiretopengineer/hiretopengineer.module';
import { HiretopengineerService } from './hiretopengineer/hiretopengineer.service';
import { HomePageController } from './homePage/homePage.controller';
import { HomePageModule } from './homePage/homePage.module';
import { HomePageService } from './homePage/homePage.service';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '@nestjs-modules/mailer';
import { MyteamController } from './myTeam/myteam.controller';
import { MyteamModule } from './myTeam/myteam.module';
import { MyteamService } from './myTeam/myteam.service';
import { PrismaService } from './prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Storage } from '@google-cloud/storage';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { urlencoded } from 'express';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DocumentModule,
    HttpModule,
    MyteamModule,
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        // auth: {
        //   user: 'support@eremotehire.com',
        //   pass: 'HTESX7KgAxVk',
        // },
        auth: {
          user: 'test.shrihari@gmail.com',
          pass: 'rngw lbvg fwpb keib',
        },
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
      },
    }),
    ApplyAsEngineerModule,
    HiretopengineerModule,
    HomePageModule,
    DevdashboardModule,
    ClientdashboardModule,
  ],
  controllers: [
    AppController,
    UserController,
    DocumentController,
    MyteamController,
    ApplyAsEngineerController,
    HiretopengineerController,
    HomePageController,
    DevdashboardController,
    ClientdashboardController,
  ],
  providers: [
    AppService,
    PrismaService,
    UserService,
    DocumentService,
    EmailCronService,
    AuthService,
    MyteamService,
    ApplyAsEngineerService,
    HiretopengineerService,
    HomePageService,
    DevdashboardService,
    ClientdashboardService,
    Storage
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(urlencoded({ extended: true }), AuthMiddleware).forRoutes('*');
  }
}
