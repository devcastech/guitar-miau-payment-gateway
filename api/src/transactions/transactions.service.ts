import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { products: productIds, ...transactionData } = createTransactionDto;

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Uno o más productos no fueron encontrados');
    }

    const transaction = this.transactionRepository.create({
      ...transactionData,
      products,
    });

    return this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: ['products'],
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return transaction;
  }

  async updateStatus(id: string, status: string): Promise<Transaction> {
    const transaction = await this.findOne(id);
    transaction.status = status;
    return this.transactionRepository.save(transaction);
  }
}
