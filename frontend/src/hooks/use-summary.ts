"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { transactionKeys } from "./use-transactions";

export function useDailySummary(date: string) {
  return useQuery({
    queryKey: [...transactionKeys.summary, "daily", date],
    queryFn: () => api.summary.daily(date),
    placeholderData: keepPreviousData,
  });
}

export function useMonthlySummary(month: string) {
  return useQuery({
    queryKey: [...transactionKeys.summary, "monthly", month],
    queryFn: () => api.summary.monthly(month),
    placeholderData: keepPreviousData,
  });
}

export function useYearlySummary(year: string) {
  return useQuery({
    queryKey: [...transactionKeys.summary, "yearly", year],
    queryFn: () => api.summary.yearly(year),
    placeholderData: keepPreviousData,
  });
}
