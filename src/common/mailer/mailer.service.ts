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


  async sendContact(contactData: {
    firstname: string;
    lastname: string;
    email: string;       
    mur_email:string
    message: string;     
    date: string;       
    houseName: string;  
    mur_phone:string 
  }) {
    const { firstname, mur_email,mur_phone, lastname, email, message, date, houseName } = contactData;
  
    await this.mailerService.sendMail({
      to: email,
      subject: `Hurmatli ${firstname} ${lastname}, murojaatingiz qabul qilindi`,
      template: 'user-confirmation', 
      context: {
        firstname,
        lastname,
        date,
        year: new Date().getFullYear(),
      },
    });

    await this.mailerService.sendMail({
      to: mur_email, 
      subject: `Murojaat Xabari: ${firstname} ${lastname} dan`,
      template: 'admin-contact', 
      context: {
        firstname,
        lastname,
        email,
        mur_phone,
        message,
        houseName,
        date,
        year: new Date().getFullYear(),
      },
    });
  }
  
  
}
