import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../../products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('transaction_products')
export class TransactionProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.transactionProducts,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @Column('int')
  quantity: number;

  @ApiProperty({
    description: 'Precio del producto al momento de la transacción',
    example: 1500.5,
  })
  @Column('decimal', {
    precision: 10,
    scale: 2,
    name: 'price_at_time',
  })
  priceAtTime: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
