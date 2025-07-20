import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';

@ApiTags('Guitars')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Getl all available Guitars',
  })
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a Guitar by id',
  })
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id/update-stock')
  @ApiOperation({
    summary: 'Update product stock by subtracting sold units',
  })
  @ApiResponse({
    status: 200,
    description: 'The stock has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid stock amount or insufficient stock.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async updateStock(
    @Param('id') id: string,
    @Body() updateProductStockDto: UpdateProductStockDto,
  ) {
    return await this.productsService.updateStock(id, updateProductStockDto);
  }
}
