"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  // Keep server requests isolated and preserve the browser cache across renders.
  if (typeof window === "undefined") {
    return new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });
  }
  browserQueryClient ??= new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
