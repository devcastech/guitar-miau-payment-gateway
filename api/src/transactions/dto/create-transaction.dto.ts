import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNumber,
  ArrayMinSize,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TransactionProductDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de producto debe ser un UUID válido' })
  productId: string;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'External ID of the transaction (from payment gateway)',
    example: 'txn_1234567890',
  })
  @IsString()
  externalId: string;

  @ApiProperty({
    description: 'Reference number for the transaction',
    example: 'REF_GM_1753050658303',
    required: false,
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'Status of the transaction',
    example: 'pending',
    enum: ['pending', 'completed', 'failed'],
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Total amount of the transaction',
    example: 12000000,
  })
  @IsNumber()
  totalAmount?: number;

  @ApiProperty({
    description: 'Array de productos con sus cantidades',
    type: [TransactionProductDto],
    example: [
      { productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 2 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Se requiere al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => TransactionProductDto)
  products: TransactionProductDto[];

  @ApiProperty({
    description: 'UUID of the customer making the transaction',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID('4', { message: 'El ID de cliente debe ser un UUID válido' })
  customer: string;
}
