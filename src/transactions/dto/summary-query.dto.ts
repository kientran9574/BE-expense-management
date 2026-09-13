import { Matches } from 'class-validator';

export class DailySummaryQueryDto {
  /** Format: YYYY-MM-DD */
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date!: string;
}

export class MonthlySummaryQueryDto {
  /** Format: YYYY-MM */
  @Matches(/^\d{4}-\d{2}$/, { message: 'month must be in YYYY-MM format' })
  month!: string;
}

export class YearlySummaryQueryDto {
  /** Format: YYYY */
  @Matches(/^\d{4}$/, { message: 'year must be in YYYY format' })
  year!: string;
}
