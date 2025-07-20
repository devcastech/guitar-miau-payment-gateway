import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll() {
    try {
      const [data, count] = await this.productRepository.findAndCount();
      return { data, count };
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener los productos');
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.productRepository.findOne({
        where: { id },
      });

      if (!result) {
        throw new NotFoundException('Producto no encontrado');
      }

      return { data: result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('No se pudo realizar el proceso');
    }
  }

  async updateStock(id: string, updateStockDto: UpdateProductStockDto) {
    const { stock: stockToSubtract } = updateStockDto;

    if (stockToSubtract <= 0) {
      throw new BadRequestException('La cantidad debe ser un número positivo');
    }

    return await this.productRepository.manager.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      if (product.stock < stockToSubtract) {
        throw new BadRequestException(
          `Stock insufiente. Disponible: ${product.stock}, Solicitado: ${stockToSubtract}`,
        );
      }

      product.stock -= stockToSubtract;

      const updatedProduct = await manager.save(Product, product);

      return { data: updatedProduct };
    });
  }
}
