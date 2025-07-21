import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { WebhookModule } from '../webhook/webhook.module';
import { TransactionProduct } from './entities/transaction-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Product,
      Customer,
      TransactionProduct,
    ]),
    forwardRef(() => WebhookModule),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
