"use client";

import { CalendarDays, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { SpendingBarChart, type SpendingPoint } from "@/components/charts/spending-bar-chart";
import { StatTile } from "@/components/dashboard/stat-tile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailySummary, useMonthlySummary, useYearlySummary } from "@/hooks/use-summary";
import { formatCurrency, formatDate, monthLabel } from "@/lib/format";
import { useUiStore } from "@/store/ui-store";

export default function DashboardPage() {
  const { selectedDate, selectedMonth, selectedYear, setSelectedDate, setSelectedMonth, setSelectedYear } =
    useUiStore();

  const dailyQuery = useDailySummary(selectedDate);
  const monthlyQuery = useMonthlySummary(selectedMonth);
  const yearlyQuery = useYearlySummary(selectedYear);

  const dailyPoints: SpendingPoint[] =
    monthlyQuery.data?.dailyBreakdown.map((day) => ({
      label: String(Number(day.date.slice(8, 10))),
      fullLabel: formatDate(day.date),
      value: day.totalExpense,
    })) ?? [];

  const monthlyPoints: SpendingPoint[] =
    yearlyQuery.data?.monthlyBreakdown.map((month) => ({
      label: `T${Number(month.month.slice(5, 7))}`,
      fullLabel: `${monthLabel(month.month)}/${month.month.slice(0, 4)}`,
      value: month.totalExpense,
    })) ?? [];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tổng quan</h1>
          <p className="text-sm text-muted-foreground">Chi tiêu của bạn theo ngày, tháng và năm</p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-date" className="text-xs text-muted-foreground">
              Ngày
            </Label>
            <Input
              id="filter-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-month" className="text-xs text-muted-foreground">
              Tháng
            </Label>
            <Input
              id="filter-month"
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-year" className="text-xs text-muted-foreground">
              Năm
            </Label>
            <Input
              id="filter-year"
              type="number"
              min={2000}
              max={2100}
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="w-24"
            />
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Chi tiêu tháng {Number(selectedMonth.slice(5, 7))}</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyQuery.isPending ? (
            <Skeleton className="h-14 w-64" />
          ) : (
            <p className="text-5xl font-semibold leading-[1.15] tracking-tight">
              {formatCurrency(monthlyQuery.data?.totalExpense ?? 0)}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {monthlyQuery.data?.transactionCount ?? 0} giao dịch · thu nhập{" "}
            {formatCurrency(monthlyQuery.data?.totalIncome ?? 0)}
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile
          label={`Chi tiêu ngày ${formatDate(selectedDate)}`}
          value={dailyQuery.data?.totalExpense ?? 0}
          icon={CalendarDays}
          hint={`${dailyQuery.data?.transactionCount ?? 0} giao dịch`}
          isLoading={dailyQuery.isPending}
        />
        <StatTile
          label={`Chi tiêu năm ${selectedYear}`}
          value={yearlyQuery.data?.totalExpense ?? 0}
          icon={TrendingDown}
          hint={`${yearlyQuery.data?.transactionCount ?? 0} giao dịch`}
          isLoading={yearlyQuery.isPending}
        />
        <StatTile
          label={`Còn lại năm ${selectedYear}`}
          value={yearlyQuery.data?.net ?? 0}
          icon={yearlyQuery.data && yearlyQuery.data.net >= 0 ? TrendingUp : Wallet}
          hint={`Thu ${formatCurrency(yearlyQuery.data?.totalIncome ?? 0)}`}
          tone="positive"
          isLoading={yearlyQuery.isPending}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiêu theo ngày</CardTitle>
          <CardDescription>
            Từng ngày trong tháng {Number(selectedMonth.slice(5, 7))}/{selectedMonth.slice(0, 4)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingBarChart
            data={dailyPoints}
            isFetching={monthlyQuery.isFetching}
            emptyMessage="Chưa có chi tiêu nào trong tháng này"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiêu theo tháng</CardTitle>
          <CardDescription>12 tháng của năm {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingBarChart
            data={monthlyPoints}
            isFetching={yearlyQuery.isFetching}
            emptyMessage="Chưa có chi tiêu nào trong năm này"
          />
        </CardContent>
      </Card>
    </div>
  );
}
