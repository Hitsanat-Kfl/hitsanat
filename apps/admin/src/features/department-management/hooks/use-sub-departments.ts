"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { SubDepartment } from "@/domains/definitions";

interface UseSubDepartmentsResult {
  departments: SubDepartment[];
  loading: boolean;
  error: string | null;
}

export function useSubDepartments(): UseSubDepartmentsResult {
  const query = useQuery({
    queryKey: ["sub-departments"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SubDepartment[]>>("/sub-departments");
      return response.data;
    },
  });

  return {
    departments: query.data ?? [],
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch departments") : null,
  };
}
