import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { TransactionType } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';

interface PeriodTotals {
  totalIncome: number;
  totalExpense: number;
  net: number;
}

function emptyTotals(): PeriodTotals {
  return { totalIncome: 0, totalExpense: 0, net: 0 };
}

function addToTotals(totals: PeriodTotals, type: TransactionType, amount: number) {
  if (type === TransactionType.INCOME) {
    totals.totalIncome += amount;
  } else {
    totals.totalExpense += amount;
  }
  totals.net = totals.totalIncome - totals.totalExpense;
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTransactionDto) {
    return this.prisma.transaction.create({ data: dto, include: { category: true } });
  }

  findAll(query: ListTransactionsQueryDto) {
    const where: Prisma.TransactionWhereInput = {};
    if (query.from || query.to) {
      where.date = {};
      if (query.from) where.date.gte = query.from;
      if (query.to) where.date.lte = query.to;
    }
    if (query.type) where.type = query.type;
    if (query.categoryId) where.categoryId = query.categoryId;

    return this.prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    await this.findOne(id);
    return this.prisma.transaction.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.transaction.delete({ where: { id } });
  }

  /** Total income/expense for a single calendar day (UTC). */
  async getDailySummary(dateStr: string) {
    const start = new Date(`${dateStr}T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const transactions = await this.prisma.transaction.findMany({
      where: { date: { gte: start, lt: end } },
    });

    const totals = emptyTotals();
    for (const tx of transactions) {
      addToTotals(totals, tx.type, Number(tx.amount));
    }

    return { date: dateStr, ...totals, transactionCount: transactions.length };
  }

  /** Total income/expense for a whole month, broken down by day. */
  async getMonthlySummary(monthStr: string) {
    const [year, month] = monthStr.split('-').map(Number);
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    const transactions = await this.prisma.transaction.findMany({
      where: { date: { gte: start, lt: end } },
    });

    const dailyBreakdown = new Map<string, PeriodTotals>();
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${monthStr}-${String(day).padStart(2, '0')}`;
      dailyBreakdown.set(key, emptyTotals());
    }

    const totals = emptyTotals();
    for (const tx of transactions) {
      const key = tx.date.toISOString().slice(0, 10);
      const dayTotals = dailyBreakdown.get(key) ?? emptyTotals();
      addToTotals(dayTotals, tx.type, Number(tx.amount));
      dailyBreakdown.set(key, dayTotals);
      addToTotals(totals, tx.type, Number(tx.amount));
    }

    return {
      month: monthStr,
      ...totals,
      transactionCount: transactions.length,
      dailyBreakdown: Array.from(dailyBreakdown.entries()).map(([date, value]) => ({
        date,
        ...value,
      })),
    };
  }

  /** Total income/expense for a whole year, broken down by month. */
  async getYearlySummary(yearStr: string) {
    const year = Number(yearStr);
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));

    const transactions = await this.prisma.transaction.findMany({
      where: { date: { gte: start, lt: end } },
    });

    const monthlyBreakdown = new Map<string, PeriodTotals>();
    for (let month = 1; month <= 12; month++) {
      const key = `${yearStr}-${String(month).padStart(2, '0')}`;
      monthlyBreakdown.set(key, emptyTotals());
    }

    const totals = emptyTotals();
    for (const tx of transactions) {
      const key = tx.date.toISOString().slice(0, 7);
      const monthTotals = monthlyBreakdown.get(key) ?? emptyTotals();
      addToTotals(monthTotals, tx.type, Number(tx.amount));
      monthlyBreakdown.set(key, monthTotals);
      addToTotals(totals, tx.type, Number(tx.amount));
    }

    return {
      year: yearStr,
      ...totals,
      transactionCount: transactions.length,
      monthlyBreakdown: Array.from(monthlyBreakdown.entries()).map(([month, value]) => ({
        month,
        ...value,
      })),
    };
  }
}
