import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockTransactionRepository: any;
  let mockProductRepository: any;
  let mockCustomerRepository: any;

  const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
    id: '123',
    name: 'Test Guitar',
    description: 'Test Guitar Description',
    price: 1000,
    stock: 10,
    image: 'test.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createMockCustomer = (overrides: Partial<Customer> = {}): Customer => ({
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '1234567890',
    address: 'Test Address',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createMockTransaction = (
    overrides: Partial<Transaction> = {},
  ): Transaction => ({
    id: '456',
    externalId: 'ext-123',
    status: 'pending',
    totalAmount: 1000,
    products: [createMockProduct()],
    customer: createMockCustomer(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    mockTransactionRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockProductRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockCustomerRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTransactionDto: CreateTransactionDto = {
      externalId: 'ext-123',
      status: 'pending',
      totalAmount: 1000,
      products: ['123', '456'],
      customer: '550e8400-e29b-41d4-a716-446655440000',
    };

    it('should successfully create a transaction when valid data is provided', async () => {
      const mockProducts = [
        createMockProduct({ id: '123' }),
        createMockProduct({ id: '456' }),
      ];
      const mockCustomer = createMockCustomer();
      const mockTransaction = createMockTransaction();

      mockProductRepository.find.mockResolvedValue(mockProducts);
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(createTransactionDto);

      expect(mockProductRepository.find).toHaveBeenCalled();
      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
      });
      expect(mockTransactionRepository.create).toHaveBeenCalledWith({
        externalId: 'ext-123',
        status: 'pending',
        totalAmount: 1000,
        products: mockProducts,
        customer: mockCustomer,
      });
      expect(mockTransactionRepository.save).toHaveBeenCalledWith(
        mockTransaction,
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException when one or more products are not found', async () => {
      const mockProducts = [
        createMockProduct({ id: 'this-product-id-no-exsits' }),
      ];
      const mockCustomer = createMockCustomer();

      mockProductRepository.find.mockResolvedValue(mockProducts);
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);

      await expect(service.create(createTransactionDto)).rejects.toThrow(
        new NotFoundException('Uno o más productos no fueron encontrados'),
      );
      expect(mockProductRepository.find).toHaveBeenCalled();
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when customer is not found', async () => {
      const mockProducts = [
        createMockProduct({ id: '123' }),
        createMockProduct({ id: '456' }),
      ];

      mockProductRepository.find.mockResolvedValue(mockProducts);
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTransactionDto)).rejects.toThrow(
        new NotFoundException(
          'Cliente con ID 550e8400-e29b-41d4-a716-446655440000 no encontrado',
        ),
      );
      expect(mockProductRepository.find).toHaveBeenCalled();
      expect(mockCustomerRepository.findOne).toHaveBeenCalled();
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions with products', async () => {
      const mockTransactions = [
        createMockTransaction(),
        createMockTransaction({ id: '789' }),
      ];
      mockTransactionRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.findAll();

      expect(mockTransactionRepository.find).toHaveBeenCalledWith({
        relations: ['products', 'customer'],
      });
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('findOne', () => {
    it('should return a transaction when valid ID is provided', async () => {
      const id = '49956';
      const mockTransaction = createMockTransaction({ id });
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(id);

      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['products', 'customer'],
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException when transaction does not exist', async () => {
      const id = '9939';
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Transacción con ID ${id} no encontrada`),
      );
      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['products', 'customer'],
      });
    });
  });

  describe('updateStatus', () => {
    it('should successfully update transaction status', async () => {
      const id = '9290';
      const newStatus = 'completed';
      const mockTransaction = createMockTransaction({ id, status: 'pending' });
      const updatedTransaction = createMockTransaction({
        id,
        status: newStatus,
      });

      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(updatedTransaction);

      const result = await service.updateStatus(id, newStatus);

      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['products', 'customer'],
      });
      expect(mockTransactionRepository.save).toHaveBeenCalledWith({
        ...mockTransaction,
        status: newStatus,
      });
      expect(result).toEqual(updatedTransaction);
      expect(result.status).toEqual(newStatus);
    });

    it('should throw NotFoundException when transaction does not exist', async () => {
      const id = '92929';
      const newStatus = 'completed';
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(id, newStatus)).rejects.toThrow(
        new NotFoundException(`Transacción con ID ${id} no encontrada`),
      );
      expect(mockTransactionRepository.findOne).toHaveBeenCalled();
      expect(mockTransactionRepository.save).not.toHaveBeenCalled();
    });
  });
});
