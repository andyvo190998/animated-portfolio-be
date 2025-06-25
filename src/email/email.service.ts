/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendEmail(subject: string, from: string, html: string) {
    const mailOptions = {
      from: `"Andy vo portfolio" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject,
      html: `<div><b>From: ${from}</b><p>${html}</p></div>`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      return new Error(`Failed to send email: ${error.message}`);
    }
  }
}
