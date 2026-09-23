"use client";

import { useQuery } from "@tanstack/react-query";
import { type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { AnnualMasterPlan, Pagination } from "@/domains/definitions";

interface UsePlansResult {
  plans: AnnualMasterPlan[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePlans(): UsePlansResult {
  const query = useQuery({
    queryKey: ["annual-plans"],
    queryFn: async () => api.get<PaginatedResponse<AnnualMasterPlan>>("/annual-plans?limit=100"),
  });

  return {
    plans: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch plans") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
