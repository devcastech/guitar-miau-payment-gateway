import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeliveriesService } from './deliveries.service';
import { Delivery } from './entities/delivery.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { NotFoundException } from '@nestjs/common';
import { Customer } from '../customers/entities/customer.entity';

describe('DeliveriesService', () => {
  let service: DeliveriesService;
  let deliveryRepository: {
    create: jest.Mock;
    save: jest.Mock;
  };
  let transactionRepository: {
    findOne: jest.Mock;
  };

  const mockDelivery: Partial<Delivery> = {
    id: '1',
    status: 'pending',
    address: '123 Test St',
    transaction: { id: '1' } as Transaction,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCustomer: Customer = {
    id: '1',
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '1234567890',
    address: '123 Test St',
    transactions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction: Partial<Transaction> = {
    id: '1',
    status: 'completed',
    customer: mockCustomer,
  };

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        {
          provide: getRepositoryToken(Delivery),
          useValue: {
            create: jest.fn().mockReturnValue(mockDelivery),
            save: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    service = module.get<DeliveriesService>(DeliveriesService);
    deliveryRepository = module.get(getRepositoryToken(Delivery));
    transactionRepository = module.get(getRepositoryToken(Transaction));
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a delivery for a valid transaction', async () => {
      const createDeliveryDto = { transactionId: '1' };

      const result = await service.create(createDeliveryDto);

      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['customer'],
      });

      expect(deliveryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'pending',
          transaction: mockTransaction,
          address: mockCustomer.address,
        }),
      );

      expect(deliveryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'pending',
          address: mockCustomer.address,
        }),
      );

      expect(result).toMatchObject({
        status: 'pending',
        address: mockCustomer.address,
      });
    });

    it('should throw NotFoundException when transaction is not found', async () => {
      transactionRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.create({ transactionId: '999' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
