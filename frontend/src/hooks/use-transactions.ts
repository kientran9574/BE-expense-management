"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { CreateTransactionInput, TransactionFilters } from "@/lib/types";

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (filters: TransactionFilters) => ["transactions", "list", filters] as const,
  summary: ["transactions", "summary"] as const,
};

function invalidateTransactionData(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: transactionKeys.all });
}

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => api.transactions.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => api.transactions.create(input),
    onSuccess: () => {
      invalidateTransactionData(queryClient);
      toast.success("Đã thêm giao dịch");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<CreateTransactionInput> & { id: string }) =>
      api.transactions.update(id, input),
    onSuccess: () => {
      invalidateTransactionData(queryClient);
      toast.success("Đã cập nhật giao dịch");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.transactions.remove(id),
    onSuccess: () => {
      invalidateTransactionData(queryClient);
      toast.success("Đã xóa giao dịch");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
