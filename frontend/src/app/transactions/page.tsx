"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategories } from "@/hooks/use-categories";
import { useDeleteTransaction, useTransactions } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction, TransactionType } from "@/lib/types";
import { useUiStore } from "@/store/ui-store";

const ALL = "ALL";

export default function TransactionsPage() {
  const { transactionFilters, setTransactionFilters } = useUiStore();
  const { data: categories = [] } = useCategories();
  const { data: transactions = [], isPending, isFetching } = useTransactions(transactionFilters);
  const deleteTransaction = useDeleteTransaction();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>();

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function openEdit(transaction: Transaction) {
    setEditing(transaction);
    setDialogOpen(true);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Giao dịch</h1>
          <p className="text-sm text-muted-foreground">Thêm, sửa và xóa các khoản thu chi</p>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Thêm giao dịch
        </Button>
      </header>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="from" className="text-xs text-muted-foreground">
              Từ ngày
            </Label>
            <Input
              id="from"
              type="date"
              className="w-40"
              value={transactionFilters.from ?? ""}
              onChange={(event) =>
                setTransactionFilters({ ...transactionFilters, from: event.target.value || undefined })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="to" className="text-xs text-muted-foreground">
              Đến ngày
            </Label>
            <Input
              id="to"
              type="date"
              className="w-40"
              value={transactionFilters.to ?? ""}
              onChange={(event) =>
                setTransactionFilters({ ...transactionFilters, to: event.target.value || undefined })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-type" className="text-xs text-muted-foreground">
              Loại
            </Label>
            <Select
              value={transactionFilters.type ?? ALL}
              onValueChange={(value) =>
                setTransactionFilters({
                  ...transactionFilters,
                  type: value === ALL ? undefined : (value as TransactionType),
                })
              }
            >
              <SelectTrigger id="filter-type" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả</SelectItem>
                <SelectItem value="EXPENSE">Chi tiêu</SelectItem>
                <SelectItem value="INCOME">Thu nhập</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-category" className="text-xs text-muted-foreground">
              Danh mục
            </Label>
            <Select
              value={transactionFilters.categoryId ?? ALL}
              onValueChange={(value) =>
                setTransactionFilters({
                  ...transactionFilters,
                  categoryId: value === ALL ? undefined : value,
                })
              }
            >
              <SelectTrigger id="filter-category" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {Object.values(transactionFilters).some(Boolean) && (
            <Button variant="ghost" onClick={() => setTransactionFilters({})}>
              Xóa lọc
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isPending ? (
            <div className="flex flex-col gap-2 p-5">
              {[0, 1, 2, 3].map((row) => (
                <Skeleton key={row} className="h-10 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Chưa có giao dịch nào. Nhấn &quot;Thêm giao dịch&quot; để bắt đầu.
            </p>
          ) : (
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="tabular whitespace-nowrap">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className="size-2 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                transaction.type === "EXPENSE" ? "var(--chart-1)" : "var(--chart-3)",
                            }}
                          />
                          {transaction.category?.name ?? "—"}
                          <Badge variant="outline">
                            {transaction.type === "EXPENSE" ? "Chi" : "Thu"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-muted-foreground">
                        {transaction.note ?? "—"}
                      </TableCell>
                      <TableCell className="tabular whitespace-nowrap text-right font-medium">
                        {transaction.type === "EXPENSE" ? "-" : "+"}
                        {formatCurrency(Number(transaction.amount))}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(transaction)}>
                            <Pencil />
                            <span className="sr-only">Sửa</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Xóa giao dịch này?")) deleteTransaction.mutate(transaction.id);
                            }}
                          >
                            <Trash2 />
                            <span className="sr-only">Xóa</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editing} />
    </div>
  );
}
