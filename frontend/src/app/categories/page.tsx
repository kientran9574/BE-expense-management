"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-categories";
import type { TransactionType } from "@/lib/types";

export default function CategoriesPage() {
  const { data: categories = [], isPending } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await createCategory.mutateAsync({ name: name.trim(), type });
      setName("");
    } catch {
      // The mutation hook surfaces the error as a toast.
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Danh mục</h1>
        <p className="text-sm text-muted-foreground">Phân loại các khoản thu và chi của bạn</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Thêm danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-48 flex-1 flex-col gap-1.5">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ăn uống, Di chuyển, Lương..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category-type">Loại</Label>
              <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
                <SelectTrigger id="category-type" className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Chi tiêu</SelectItem>
                  <SelectItem value="INCOME">Thu nhập</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={createCategory.isPending || !name.trim()}>
              <Plus />
              {createCategory.isPending ? "Đang thêm..." : "Thêm"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isPending ? (
            <div className="flex flex-col gap-2 p-5">
              {[0, 1, 2].map((row) => (
                <Skeleton key={row} className="h-10 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Chưa có danh mục nào. Thêm danh mục đầu tiên ở trên.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category.type === "EXPENSE" ? "Chi tiêu" : "Thu nhập"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Xóa danh mục "${category.name}"?`)) {
                              deleteCategory.mutate(category.id);
                            }
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
