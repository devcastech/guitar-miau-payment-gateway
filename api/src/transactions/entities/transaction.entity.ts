import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'ID of the transaction payment-gateway',
    example: '1234567890',
  })
  @Column({
    name: 'external_id',
  })
  externalId: string;

  @ApiProperty({
    description: 'Status of the transaction',
    example: 'pending|completed|failed',
  })
  @Column()
  status: string;

  @ApiProperty({
    description: 'Total amount of the transaction',
    example: '100.00',
  })
  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @ApiProperty({
    description: 'Products of the transaction',
    type: [Product],
    isArray: true,
  })
  @ManyToMany(() => Product, { eager: true })
  @JoinTable({
    name: 'transaction_products',
    joinColumn: { name: 'transaction_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];

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
