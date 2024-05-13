import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  // async sendMail() {
  //   await this.mailerService.sendMail({
  //     from: 'mmihir4u@gmail.com', // sender address
  //     to: "mihirmistry369@gmail.com", // list of receivers
  //     subject: "Hello", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: '<div style="font-family: Helvetica, Arial, sans-serif; min-width:1000px; overflow:auto; line-height:2; background:#000; color: #fff;">' +
  //           '<div style="width:70%; padding:20px 0">' +
  //             '<div style="width: 100%;">' +
  //               '<img src="https://eremotehire.com/images/remotehire.png" alt="eRemoteHire" style="width: 200px; height: 100px;">' +
  //             '</div>' +
  //             '<hr>' +
  //             '<p style="font-size:1.1em">Hi,</p>' +
  //             '<p>Hi FN LN, Please make sure to keep your profile up to date</p>' +
  //             '<p style="font-size:0.9em;">Best wishes,<br />eRemoteHire Team</p>' +
  //             '<hr style="border:none; border-top:1px solid #eee" />' +
  //             '<div style="padding:8px 0; color:#aaa; font-size:0.8em; line-height:1; font-weight:300">' +
  //               '<p>Any question? Simply reply to this email.</p>' +
  //               '<a href="support@eremotehire.com" style="color:#BC7666;">support@eremotehire.com</a>' +
  //             '</div>' +
  //             '<hr>' +
  //           '</div>' +
  //         '</div>',
  //   });
  // }
}
