import { IsString } from 'class-validator';

export class UpdateTransactionStatusDto {
  @IsString()
  status: string;
}
