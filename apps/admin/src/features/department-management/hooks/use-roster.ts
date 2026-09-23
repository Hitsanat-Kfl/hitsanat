"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { SubDepartmentMember } from "@/domains/definitions";

interface UseRosterResult {
  members: SubDepartmentMember[];
  loading: boolean;
  error: string | null;
}

export function useRoster(code: string): UseRosterResult {
  const query = useQuery({
    queryKey: ["sub-departments", code, "roster"],
    enabled: Boolean(code),
    queryFn: async () => {
      const response = await api.get<ApiResponse<SubDepartmentMember[]>>(
        `/sub-departments/${code}/roster`
      );
      return response.data;
    },
  });

  return {
    members: query.data ?? [],
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch roster") : null,
  };
}
