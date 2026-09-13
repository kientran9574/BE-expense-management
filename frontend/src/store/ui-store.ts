import { create } from "zustand";
import { toDateKey, toMonthKey } from "@/lib/format";
import type { TransactionFilters } from "@/lib/types";

interface UiState {
  /** Day the dashboard's "hôm nay" tile reads, as YYYY-MM-DD. */
  selectedDate: string;
  /** Month the dashboard charts scope to, as YYYY-MM. */
  selectedMonth: string;
  /** Year the yearly chart scopes to, as YYYY. */
  selectedYear: string;
  transactionFilters: TransactionFilters;
  setSelectedDate: (date: string) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
  setTransactionFilters: (filters: TransactionFilters) => void;
}

const today = new Date();

export const useUiStore = create<UiState>((set) => ({
  selectedDate: toDateKey(today),
  selectedMonth: toMonthKey(today),
  selectedYear: String(today.getFullYear()),
  transactionFilters: {},
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedMonth: (selectedMonth) => set({ selectedMonth }),
  setSelectedYear: (selectedYear) => set({ selectedYear }),
  setTransactionFilters: (transactionFilters) => set({ transactionFilters }),
}));
