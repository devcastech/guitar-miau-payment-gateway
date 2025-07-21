import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WebhookService } from './webhook.service';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { ProductsService } from '../products/products.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionProduct } from '../transactions/entities/transaction-product.entity';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { NotFoundException } from '@nestjs/common';
import { Customer } from '../customers/entities/customer.entity';
import { Product } from '../products/entities/product.entity';

const createMockCustomer = (overrides: Partial<Customer> = {}): Customer => {
  const customer = new Customer();
  customer.id = '550e8400-e29b-41d4-a716-446655440000';
  customer.name = 'Test Customer';
  customer.email = 'test@example.com';
  customer.phone = '1234567890';
  customer.address = '123 Test St';
  customer.createdAt = new Date();
  customer.updatedAt = new Date();
  customer.transactions = [];
  return Object.assign(customer, overrides);
};

const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '123',
  name: 'Test Product',
  description: 'Test Description',
  price: 1000,
  stock: 10,
  image: 'test.jpg',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('WebhookService', () => {
  let service: WebhookService;
  let deliveriesService: jest.Mocked<DeliveriesService>;
  let productsService: jest.Mocked<Pick<ProductsService, 'updateStock'>>;
  let transactionRepository: {
    findOne: jest.Mock<Promise<Transaction | null>, [any?]>;
    save: jest.Mock<Promise<Transaction>, [Transaction]>;
    [key: string]: jest.Mock;
  };

  const mockCustomer = createMockCustomer();
  const mockProduct = createMockProduct();

  const createMockTransaction = (
    overrides: Partial<Transaction> = {},
  ): Transaction => {
    const mockTransaction = new Transaction();
    mockTransaction.id = '123';
    mockTransaction.externalId = 'ext_123';
    mockTransaction.status = 'pending';
    mockTransaction.totalAmount = 1000;
    mockTransaction.reference = 'ref_123';
    mockTransaction.customer = mockCustomer;
    mockTransaction.transactionProducts = [];
    mockTransaction.createdAt = new Date();
    mockTransaction.updatedAt = new Date();
    Object.assign(mockTransaction, overrides);

    const mockTransactionProduct = new TransactionProduct();
    mockTransactionProduct.id = '789';
    mockTransactionProduct.quantity = 1;
    mockTransactionProduct.priceAtTime = 1000;
    mockTransactionProduct.product = mockProduct;
    mockTransactionProduct.transaction = mockTransaction;
    mockTransactionProduct.createdAt = new Date();
    mockTransaction.transactionProducts = [mockTransactionProduct];

    return mockTransaction;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: DeliveriesService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 'delivery-123',
              status: 'pending',
              address: '123 Test St',
              transaction: { id: '456' },
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            updateStock: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOne: jest.fn(),
            save: jest
              .fn()
              .mockImplementation((transaction) =>
                Promise.resolve(transaction),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
    deliveriesService = module.get(DeliveriesService);
    productsService = module.get(ProductsService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validatePaymentStatus', () => {
    const createWebhookDto: CreateWebhookDto = {
      event: 'transaction.updated',
      sent_at: new Date().toISOString(),
      data: {
        transaction: {
          id: 'txn_123',
          reference: 'ref_123',
          status: 'APPROVED',
        },
        signature: {
          checksum: 'test_checksum_123',
          properties: ['id', 'status', 'reference'],
        },
      },
    };

    it('should process an approved payment', async (): Promise<void> => {
      const transaction = createMockTransaction({
        status: 'pending',
        externalId: 'txn_123',
        reference: 'ref_123',
      });

      transactionRepository.findOne.mockResolvedValue(transaction);

      const result = await service.validatePaymentStatus(createWebhookDto);

      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: [{ externalId: 'txn_123' }, { reference: 'ref_123' }],
        relations: [
          'customer',
          'transactionProducts',
          'transactionProducts.product',
        ],
      });

      expect(transactionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'completed',
        }),
      );

      expect(deliveriesService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionId: transaction.id,
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          transactionId: transaction.id,
          status: 'completed',
          processedAt: expect.any(String),
        }),
      );
    });

    it('should throw NotFoundException when transaction not found', async (): Promise<void> => {
      transactionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.validatePaymentStatus(createWebhookDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

