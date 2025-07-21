import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { TransactionProduct } from './entities/transaction-product.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(TransactionProduct)
    private transactionProductRepository: Repository<TransactionProduct>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const {
      products: transactionProducts,
      customer: customerId,
      ...transactionData
    } = createTransactionDto;

    const productIds = transactionProducts.map((item) => item.productId);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    if (products.length !== new Set(productIds).size) {
      const foundIds = products.map((p) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Los siguientes productos no fueron encontrados: ${missingIds.join(', ')}`,
      );
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${customerId} no encontrado`);
    }

    const transaction = this.transactionRepository.create({
      ...transactionData,
      customer,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    const transactionProductsToSave = transactionProducts.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${item.productId} no encontrado`,
        );
      }
      return this.transactionProductRepository.create({
        transaction: savedTransaction,
        product,
        quantity: item.quantity,
        priceAtTime: product.price,
      });
    });

    await this.transactionProductRepository.save(transactionProductsToSave);
    return savedTransaction;
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: [
        'transactionProducts',
        'transactionProducts.product',
        'customer',
      ],
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: [
        'transactionProducts',
        'transactionProducts.product',
        'customer',
      ],
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
