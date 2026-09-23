"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { SubDeptDashboard } from "@/domains/definitions";

interface UseSubDeptDashboardResult {
  dashboard: SubDeptDashboard | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSubDeptDashboard(code: string): UseSubDeptDashboardResult {
  const query = useQuery({
    queryKey: ["sub-departments", code, "dashboard"],
    enabled: Boolean(code),
    queryFn: async () => {
      const response = await api.get<ApiResponse<SubDeptDashboard>>(
        `/sub-departments/${code}/dashboard`
      );
      return response.data;
    },
  });

  return {
    dashboard: query.data ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch dashboard") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
