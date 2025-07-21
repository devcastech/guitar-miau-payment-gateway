import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WebhookService {
  constructor(
    @Inject(forwardRef(() => DeliveriesService))
    private readonly deliveriesService: DeliveriesService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async validatePaymentStatus(createWebhookDto: CreateWebhookDto) {
    const { data } = createWebhookDto;
    const { transaction } = data;
    const { id: transactionId, reference, status } = transaction;

    const existingTransaction = await this.transactionRepository.findOne({
      where: [{ externalId: transactionId }, { reference: reference }],
      relations: [
        'customer',
        'transactionProducts',
        'transactionProducts.product',
      ],
    });

    if (!existingTransaction) {
      throw new NotFoundException(
        `La transacción ${reference} no se ha encontrado`,
      );
    }

    const isApproved = status === 'APPROVED';

    if (isApproved && existingTransaction.status !== 'completed') {
      // Update stock for each product in the transaction
      if (existingTransaction.transactionProducts?.length) {
        for (const item of existingTransaction.transactionProducts) {
          try {
            await this.productsService.updateStock(item.product.id, {
              stock: item.quantity,
            });
          } catch (error) {
            console.error(
              `Error updating stock for product ${item.product.id}:`,
              error.message,
            );
            throw new BadRequestException(
              `Error actualizando el stock: ${error.message}`,
            );
          }
        }
      }

      // Update transaction status
      existingTransaction.status = 'completed';
      await this.transactionRepository.save(existingTransaction);

      try {
        await this.deliveriesService.create({
          transactionId: existingTransaction.id,
        });
      } catch (error) {
        console.error('Error creating delivery:', error);
      }
    }

    return {
      success: isApproved,
      transactionId: existingTransaction.id,
      status: existingTransaction.status,
      processedAt: new Date().toISOString(),
    };
  }
}
