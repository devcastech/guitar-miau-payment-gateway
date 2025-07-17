import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  app(): { message: string } {
    return {
      message: 'API is running',
    };
  }
}
