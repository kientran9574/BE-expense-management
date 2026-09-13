import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: number;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "positive";
  isLoading?: boolean;
}

export function StatTile({ label, value, icon: Icon, hint, tone = "default", isLoading }: StatTileProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-muted-foreground">{label}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-32" />
        ) : (
          <p
            className={cn(
              "text-2xl font-semibold tracking-tight",
              tone === "positive" && value > 0 && "text-[var(--success)]",
            )}
          >
            {formatCurrency(value)}
          </p>
        )}
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
