"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { PlanWithGoals } from "@/domains/definitions";

interface UsePlanDetailResult {
  plan: PlanWithGoals | null;
  loading: boolean;
  error: string | null;
}

export function usePlanDetail(planId: string | null): UsePlanDetailResult {
  const query = useQuery({
    queryKey: ["annual-plans", planId],
    enabled: Boolean(planId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<PlanWithGoals>>(`/annual-plans/${planId}`);
      return response.data;
    },
  });

  return {
    plan: query.data ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch plan") : null,
  };
}
