"use client";

import { Table2 } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompact, formatCurrency } from "@/lib/format";

export interface SpendingPoint {
  /** Short label on the axis. */
  label: string;
  /** Full label for the tooltip and table view. */
  fullLabel: string;
  value: number;
}

interface SpendingBarChartProps {
  data: SpendingPoint[];
  /** Dimmed while a refetch is in flight, so the chart never flashes a skeleton. */
  isFetching?: boolean;
  emptyMessage?: string;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: SpendingPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{point.fullLabel}</p>
      <p className="text-sm font-semibold">{formatCurrency(point.value)}</p>
    </div>
  );
}

export function SpendingBarChart({ data, isFetching, emptyMessage }: SpendingBarChartProps) {
  const [showTable, setShowTable] = useState(false);
  const hasData = data.some((point) => point.value > 0);

  if (!hasData && emptyMessage) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
      <div className="mb-2 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setShowTable((value) => !value)}>
          <Table2 />
          {showTable ? "Xem biểu đồ" : "Xem bảng"}
        </Button>
      </div>

      {showTable ? (
        <div className="max-h-[280px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Chi tiêu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .filter((point) => point.value > 0)
                .map((point) => (
                  <TableRow key={point.fullLabel}>
                    <TableCell>{point.fullLabel}</TableCell>
                    <TableCell className="tabular text-right">{formatCurrency(point.value)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeWidth={1} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "var(--chart-grid)" }}
                tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
                tickFormatter={(value: number) => formatCompact(value)}
                width={48}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "var(--chart-grid)", fillOpacity: 0.35 }}
              />
              <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
