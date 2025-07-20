import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { getMockManager, getMockRepository, getModule } from '../../test/utils';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockManager: any;
  let mockRepository: any;

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

  beforeEach(async () => {
    mockManager = getMockManager();
    mockRepository = getMockRepository(mockManager);

    const module: TestingModule = await Test.createTestingModule(
      getModule(ProductsService, Product, mockRepository),
    ).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [createMockProduct(), createMockProduct()];
      mockRepository.findAndCount.mockResolvedValue([
        mockProducts,
        mockProducts.length,
      ]);

      const result = await service.findAll();

      expect(mockRepository.findAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockProducts,
        count: mockProducts.length,
      });
    });
  });
  describe('findOne', () => {
    it('should return a product when valid ID is provided', async () => {
      const id = '92929';
      const mockProduct = createMockProduct({ id });
      mockRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne(mockProduct.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: id },
      });
      expect(result).toEqual({ data: mockProduct });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Producto no encontrado'),
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });
  describe('updateStock', () => {
    const updateStockDto: UpdateProductStockDto = { stock: 5 };

    it('should successfully update stock when valid data is provided', async () => {
      const id = '92929';
      const mockProduct = createMockProduct({ id, stock: 10 });
      const updatedProduct = createMockProduct({ stock: 5 });
      mockManager.findOne.mockResolvedValue(mockProduct);
      mockManager.save.mockResolvedValue(updatedProduct);

      const result = await service.updateStock(id, updateStockDto);

      expect(mockManager.findOne).toHaveBeenCalledWith(Product, {
        where: { id: id },
        lock: { mode: 'pessimistic_write' },
      });
      expect(mockManager.save).toHaveBeenCalledWith(Product, {
        ...mockProduct,
        stock: 5,
      });
      expect(result).toEqual({ data: updatedProduct });
    });

    it('should throw BadRequestException when stock amount is zero', async () => {
      const invalidDto: UpdateProductStockDto = { stock: 0 };

      await expect(service.updateStock('123', invalidDto)).rejects.toThrow(
        new BadRequestException('La cantidad debe ser un número positivo'),
      );
      expect(mockManager.findOne).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when stock amount is negative', async () => {
      const invalidDto: UpdateProductStockDto = { stock: -5 };

      await expect(service.updateStock('123', invalidDto)).rejects.toThrow(
        new BadRequestException('La cantidad debe ser un número positivo'),
      );
      expect(mockManager.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockManager.findOne.mockResolvedValue(null);

      await expect(service.updateStock('999', updateStockDto)).rejects.toThrow(
        new NotFoundException('Producto no encontrado'),
      );
      expect(mockManager.findOne).toHaveBeenCalledWith(Product, {
        where: { id: '999' },
        lock: { mode: 'pessimistic_write' },
      });
      expect(mockManager.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const lowStockProduct = createMockProduct({ stock: 3 });
      const highDemandDto: UpdateProductStockDto = { stock: 5 };
      mockManager.findOne.mockResolvedValue(lowStockProduct);

      await expect(service.updateStock('123', highDemandDto)).rejects.toThrow(
        new BadRequestException(
          'Stock insufiente. Disponible: 3, Solicitado: 5',
        ),
      );
      expect(mockManager.findOne).toHaveBeenCalled();
      expect(mockManager.save).not.toHaveBeenCalled();
    });

    it('should handle exact stock amount (edge case)', async () => {
      const exactStockDto: UpdateProductStockDto = { stock: 10 };
      const productWithStock10 = createMockProduct({ stock: 10 });
      const updatedProduct = createMockProduct({ stock: 0 });

      mockManager.findOne.mockResolvedValue(productWithStock10);
      mockManager.save.mockResolvedValue(updatedProduct);

      const result = await service.updateStock('123', exactStockDto);

      expect(result).toEqual({ data: updatedProduct });
      expect(mockManager.save).toHaveBeenCalledWith(Product, {
        ...productWithStock10,
        stock: 0,
      });
    });
  });
});
