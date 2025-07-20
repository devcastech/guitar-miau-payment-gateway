import { Controller, Get, Post, Body } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Delivery } from './entities/delivery.entity';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  async create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return await this.deliveriesService.create(createDeliveryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las entregas' })
  @ApiResponse({ status: 200, type: [Delivery] })
  async findAll() {
    return await this.deliveriesService.findAll();
  }
}
