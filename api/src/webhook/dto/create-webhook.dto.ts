import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TransactionDto {
  @ApiProperty({
    description: 'ID of the transaction',
    example: '15113-1753050715-38146',
  })
  id: string;

  @ApiProperty({
    description: 'Status of the transaction',
    example: 'APPROVED',
  })
  status: string;

  @ApiProperty({
    description: 'Reference number for the transaction',
    example: 'REF_GM_1753050658303',
  })
  reference: string;
}

export class SignatureDto {
  @ApiProperty({
    description: 'Checksum for signature validation',
    example: '73bb4377eb865c17689aa3008097677184dfec355c5f1298799f2dc7e22608de',
  })
  checksum: string;

  @ApiProperty({
    description: 'List of properties used for signature generation',
    type: [String],
  })
  properties: string[];
}

class WebhookDataDto {
  @ApiProperty({
    description: 'Transaction data',
    type: TransactionDto,
  })
  transaction: TransactionDto;

  @ApiProperty({
    description: 'Signature information for validation',
    type: SignatureDto,
  })
  signature: SignatureDto;
}

export class CreateWebhookDto {
  @ApiProperty({
    description: 'Main payload data',
    type: WebhookDataDto,
  })
  data: WebhookDataDto;

  @ApiProperty({
    description: 'Type of webhook event',
    example: 'transaction.updated',
  })
  event: string;

  @ApiProperty({
    description: 'Timestamp when the webhook was sent',
    example: '2025-07-20T22:32:03.390Z',
  })
  sent_at: string;

  @ApiHideProperty()
  @IsOptional()
  timestamp?: string;

  @ApiHideProperty()
  @IsOptional()
  environment?: string;
}
