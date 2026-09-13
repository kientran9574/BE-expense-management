import type {
  Category,
  CreateCategoryInput,
  CreateTransactionInput,
  DailySummary,
  MonthlySummary,
  Transaction,
  TransactionFilters,
  YearlySummary,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(", ") : body?.message;
    throw new ApiError(message ?? `Request failed with status ${response.status}`, response.status);
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

function toQueryString(params: object) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  categories: {
    list: () => request<Category[]>("/categories"),
    create: (input: CreateCategoryInput) =>
      request<Category>("/categories", { method: "POST", body: JSON.stringify(input) }),
    update: (id: string, input: Partial<CreateCategoryInput>) =>
      request<Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    remove: (id: string) => request<Category>(`/categories/${id}`, { method: "DELETE" }),
  },
  transactions: {
    list: (filters: TransactionFilters = {}) =>
      request<Transaction[]>(`/transactions${toQueryString(filters)}`),
    create: (input: CreateTransactionInput) =>
      request<Transaction>("/transactions", { method: "POST", body: JSON.stringify(input) }),
    update: (id: string, input: Partial<CreateTransactionInput>) =>
      request<Transaction>(`/transactions/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    remove: (id: string) => request<Transaction>(`/transactions/${id}`, { method: "DELETE" }),
  },
  summary: {
    daily: (date: string) => request<DailySummary>(`/transactions/summary/daily?date=${date}`),
    monthly: (month: string) => request<MonthlySummary>(`/transactions/summary/monthly?month=${month}`),
    yearly: (year: string) => request<YearlySummary>(`/transactions/summary/yearly?year=${year}`),
  },
};

export { ApiError };
