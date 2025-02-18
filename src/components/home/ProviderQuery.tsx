"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function ProviderQuery({ children }: any) {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
