"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { PlanProgressRecord, WeeklyPlan } from "../../lib/types";

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
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlanWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyPlans = useCallback(async () => {
    if (!distributionId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<WeeklyPlan[]>>(
        `/annual-plans/distributions/${distributionId}/weekly-plans`
      );
      setWeeklyPlans(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weekly plans");
    } finally {
      setLoading(false);
    }
  }, [distributionId]);

  useEffect(() => {
    fetchWeeklyPlans();
  }, [fetchWeeklyPlans]);

  return { weeklyPlans, loading, error, refresh: fetchWeeklyPlans };
}
