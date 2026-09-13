const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 });

export function formatCurrency(value: number) {
  return currency.format(value);
}

export function formatCompact(value: number) {
  return compact.format(value);
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

/** YYYY-MM-DD in local time, the format the API expects. */
export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toMonthKey(date: Date) {
  return toDateKey(date).slice(0, 7);
}

export function monthLabel(monthKey: string) {
  return `Tháng ${Number(monthKey.slice(5, 7))}`;
}
