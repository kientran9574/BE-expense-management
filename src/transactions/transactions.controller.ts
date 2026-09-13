import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto.js';
import {
  DailySummaryQueryDto,
  MonthlySummaryQueryDto,
  YearlySummaryQueryDto,
} from './dto/summary-query.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { TransactionsService } from './transactions.service.js';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('summary/daily')
  getDailySummary(@Query() query: DailySummaryQueryDto) {
    return this.transactionsService.getDailySummary(query.date);
  }

  @Get('summary/monthly')
  getMonthlySummary(@Query() query: MonthlySummaryQueryDto) {
    return this.transactionsService.getMonthlySummary(query.month);
  }

  @Get('summary/yearly')
  getYearlySummary(@Query() query: YearlySummaryQueryDto) {
    return this.transactionsService.getYearlySummary(query.year);
  }

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListTransactionsQueryDto) {
    return this.transactionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTransactionDto) {
    return this.transactionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionsService.remove(id);
  }
}
