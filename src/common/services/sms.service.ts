import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppMailerService } from '../mailer/mailer.service';

@Injectable()
export class SmsService {
  constructor(private readonly mailerService: AppMailerService) {}

  public async sendSms(subject: string, to: string, code: number) {
    try {
      await this.mailerService.sendEmail(to, subject, code);
      return true;
    } catch (error) {
      console.error('Email yuborishda xatolik:', error.message);

      throw new HttpException(
        'Email Service: ' + (error.message || 'Xatolik yuz berdi'),
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
