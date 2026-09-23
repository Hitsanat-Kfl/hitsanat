"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { DistributionStatusItem } from "@/domains/definitions";

interface UseDistributionStatusResult {
  distributions: DistributionStatusItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDistributionStatus(planId: string | null): UseDistributionStatusResult {
  const query = useQuery({
    queryKey: ["annual-plans", planId, "distributions"],
    enabled: Boolean(planId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<DistributionStatusItem[]>>(
        `/annual-plans/${planId}/distributions`
      );
      return response.data;
    },
  });

  return {
    distributions: query.data ?? [],
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch distributions") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
