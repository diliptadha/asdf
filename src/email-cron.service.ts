import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma.service';

@Injectable()
export class EmailCronService {
  constructor(
    private readonly mailerService: MailerService,
    private prisma: PrismaService,
  ) {}
  @Cron(CronExpression.EVERY_6_MONTHS)
  async handleCron() {
    // const activeUsersData = await this.prisma.user.findMany({
    //   where: {
    //     currentStatus: 'active',
    //   },
    // });
    // for (const activeUser of activeUsersData) {
    //   try {
    //     await this.mailerService.sendMail({
    //       from: 'mmihir4u@gmail.com',
    //       to: activeUser.emailId,
    //       subject: '[ACTION REQUIRED] Update Your Profile',
    //       template: 'update_profile',
    //       context: {
    //         f_name: activeUser.firstName,
    //         l_name: activeUser.lastName,
    //         text: 'Please make sure to keep your profile up to date.',
    //       },
    //     });
    //   } catch (error) {
    //     const errorMessage = `Error sending email to ${activeUser.emailId}: ${error.message}`;
    //     // Optionally, rethrow the error to propagate it further
    //     throw new Error(errorMessage);
    //   }
    // }
  }
}
