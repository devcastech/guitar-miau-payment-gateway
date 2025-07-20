import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { Delivery } from './entities/delivery.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: createDeliveryDto.transactionId },
      relations: ['customer'],
    });

    if (!transaction) {
      throw new NotFoundException(
        `No se ha encontrado la transacción ${createDeliveryDto.transactionId}`,
      );
    }

    const delivery = this.deliveryRepository.create({
      status: 'pending',
      address: transaction.customer.address,
      transaction: transaction,
    });

    return await this.deliveryRepository.save(delivery);
  }

  async findAll(): Promise<Delivery[]> {
    return await this.deliveryRepository.find({
      relations: ['transaction', 'transaction.customer'],
    });
  }
}
