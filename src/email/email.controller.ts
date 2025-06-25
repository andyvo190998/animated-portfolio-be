import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async create(
    @Body('subject') subject: string,
    @Body('from') from: string,
    @Body('html') html: string,
  ) {
    const error = await this.emailService.sendEmail(subject, from, html);
    if (error) {
      return {
        message: error.message,
      };
    }
    return {
      message: 'Email sent successfully',
    };
  }
}
