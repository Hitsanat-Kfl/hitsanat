"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { PlanProgressRecord, WeeklyPlan } from "@/domains/definitions";

interface WeeklyPlanWithProgress extends WeeklyPlan {
  progress?: PlanProgressRecord;
}

interface UseWeeklyPlansResult {
  weeklyPlans: WeeklyPlanWithProgress[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useWeeklyPlans(distributionId: string | null): UseWeeklyPlansResult {
  const query = useQuery({
    queryKey: ["annual-plans", "distributions", distributionId, "weekly-plans"],
    enabled: Boolean(distributionId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<WeeklyPlan[]>>(
        `/annual-plans/distributions/${distributionId}/weekly-plans`
      );
      return response.data;
    },
  });

  return {
    weeklyPlans: query.data ?? [],
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch weekly plans") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
