import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../../generated/prisma/enums.js';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
