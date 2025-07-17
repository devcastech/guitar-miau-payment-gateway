import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

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

  update(id: string, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return `This action updates a #${id} product`;
  }
}
