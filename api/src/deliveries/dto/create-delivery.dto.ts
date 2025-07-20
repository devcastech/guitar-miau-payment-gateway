import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDeliveryDto {
  @IsNotEmpty({ message: 'El ID de transacción es requerido' })
  @IsUUID('4', { message: 'El ID de transacción debe ser un UUID válido' })
  transactionId: string;
}
