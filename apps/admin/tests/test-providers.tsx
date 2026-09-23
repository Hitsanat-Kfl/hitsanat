import { useState, type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider, ShellProvider } from "../src/widgets/shell";

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function QueryTestProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createTestQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function TestProviders({ children }: { children: ReactNode }) {
  return (
    <QueryTestProvider>
      <I18nProvider>
        <ShellProvider>{children}</ShellProvider>
      </I18nProvider>
    </QueryTestProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult {
  return render(ui, { wrapper: TestProviders, ...options });
}

export function createTestQueryClientForTests(): QueryClient {
  return createTestQueryClient();
}
