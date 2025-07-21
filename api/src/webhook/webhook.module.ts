import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { ProductsModule } from '../products/products.module';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionProduct } from '../transactions/entities/transaction-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionProduct]),
    forwardRef(() => TransactionsModule),
    forwardRef(() => DeliveriesModule),
    forwardRef(() => ProductsModule),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
