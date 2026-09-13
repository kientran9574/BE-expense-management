export type TransactionType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: string;
  type: TransactionType;
  date: string;
  note: string | null;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface PeriodTotals {
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export interface DailySummary extends PeriodTotals {
  date: string;
  transactionCount: number;
}

export interface MonthlySummary extends PeriodTotals {
  month: string;
  transactionCount: number;
  dailyBreakdown: (PeriodTotals & { date: string })[];
}

export interface YearlySummary extends PeriodTotals {
  year: string;
  transactionCount: number;
  monthlyBreakdown: (PeriodTotals & { month: string })[];
}

export interface CreateCategoryInput {
  name: string;
  type: TransactionType;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  note?: string;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  type?: TransactionType;
  categoryId?: string;
}
