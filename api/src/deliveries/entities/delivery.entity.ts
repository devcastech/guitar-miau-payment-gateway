import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Status of the delivery',
    example: 'pending|in_transit|delivered|failed',
  })
  @Column()
  status: string;

  @ApiProperty({
    description: 'Delivery address',
    example: '123 Main St, City, State 12345',
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'Transaction associated with this delivery',
    type: () => Transaction,
  })
  @ManyToOne(() => Transaction, { eager: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
