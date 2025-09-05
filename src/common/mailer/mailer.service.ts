import { Injectable } from '@nestjs/common';
import { MailerService as MailerServices } from '@nestjs-modules/mailer';

@Injectable()
export class AppMailerService {
  constructor(private mailerService: MailerServices) {}

  async sendEmail(email: string, subject: string, code: number) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'index',
      context: {
        subject,
        code,
        year: new Date().getFullYear(),
      },
    });
  }
}
