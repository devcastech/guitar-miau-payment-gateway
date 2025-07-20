import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CustomersService', () => {
  let service: CustomersService;
  let mockRepository: any;

  const createMockCustomer = (overrides: Partial<Customer> = {}): Customer => ({
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Robert Plant',
    email: 'robert.plant@example.com',
    phone: '9292929290',
    address: 'Calle 123 #45-67, Medellín, Colombia',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a customer when valid ID is provided', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const mockCustomer = createMockCustomer({ id });
      mockRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.findOne(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      const id = '9239939';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Cliente con ID ${id} no encontrado`),
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});