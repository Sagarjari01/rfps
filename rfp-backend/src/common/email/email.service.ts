import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailManager } from './email.manager.interface';

@Injectable()
export class EmailService implements IEmailManager {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendRfpEmail(to: string, subject: string, content: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"RFP System" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: to,
      subject: subject,
      text: content,
    });
    console.log(`📧 Email sent to ${to}`);
  }
}

