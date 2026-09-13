"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/use-transactions";
import { toDateKey } from "@/lib/format";
import type { Transaction, TransactionType } from "@/lib/types";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
}

export function TransactionDialog({ open, onOpenChange, transaction }: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? "Sửa giao dịch" : "Thêm giao dịch"}</DialogTitle>
          <DialogDescription>Nhập số tiền, ngày và danh mục cho giao dịch.</DialogDescription>
        </DialogHeader>
        {/* Remounting on open resets the fields without syncing state in an effect. */}
        {open && (
          <TransactionForm
            key={transaction?.id ?? "new"}
            transaction={transaction}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TransactionForm({
  transaction,
  onDone,
}: {
  transaction?: Transaction;
  onDone: () => void;
}) {
  const { data: categories = [] } = useCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const [amount, setAmount] = useState(transaction ? String(Number(transaction.amount)) : "");
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "EXPENSE");
  const [date, setDate] = useState(
    transaction ? transaction.date.slice(0, 10) : toDateKey(new Date()),
  );
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? "");
  const [note, setNote] = useState(transaction?.note ?? "");

  const matchingCategories = categories.filter((category) => category.type === type);
  const isPending = createTransaction.isPending || updateTransaction.isPending;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      amount: Number(amount),
      type,
      date,
      categoryId,
      note: note.trim() || undefined,
    };

    try {
      if (transaction) {
        await updateTransaction.mutateAsync({ id: transaction.id, ...payload });
      } else {
        await createTransaction.mutateAsync(payload);
      }
      onDone();
    } catch {
      // The mutation hooks surface the error as a toast.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Loại</Label>
          <Select
            value={type}
            onValueChange={(value) => {
              setType(value as TransactionType);
              setCategoryId("");
            }}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Chi tiêu</SelectItem>
              <SelectItem value="INCOME">Thu nhập</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount">Số tiền (VND)</Label>
          <Input
            id="amount"
            type="number"
            min={1}
            step={1}
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="50000"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Ngày</Label>
          <Input
            id="date"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Danh mục</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {matchingCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">Ghi chú</Label>
        <Input
          id="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Không bắt buộc"
        />
      </div>

      {matchingCategories.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Chưa có danh mục nào cho loại này. Hãy tạo danh mục trước ở mục Danh mục.
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Hủy
        </Button>
        <Button type="submit" disabled={isPending || !categoryId}>
          {isPending ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogFooter>
    </form>
  );
}
