import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new transaction',
  })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
    type: Transaction,
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTransactionStatusDto,
  ) {
    return this.transactionsService.updateStatus(id, updateStatusDto.status);
  }
}
