import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ArrayMinSize,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  externalId: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Se requiere al menos un producto' })
  @IsUUID('4', {
    each: true,
    message: 'Cada ID de producto debe ser un UUID válido',
  })
  products: string[];

  @IsString()
  @IsUUID('4', { message: 'El ID de cliente debe ser un UUID válido' })
  customer: string;
}
