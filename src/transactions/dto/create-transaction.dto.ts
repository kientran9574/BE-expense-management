import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { TransactionType } from '../../generated/prisma/enums.js';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsOptional()
  @IsString()
  note?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
