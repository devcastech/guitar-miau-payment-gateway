import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('payment-status')
  paymentStatus(@Body() createWebhookDto: CreateWebhookDto) {
    return this.webhookService.validatePaymentStatus(createWebhookDto);
  }
}
