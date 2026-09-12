"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { PlanWithGoals } from "../../lib/types";

interface UsePlanDetailResult {
  plan: PlanWithGoals | null;
  loading: boolean;
  error: string | null;
}

export function usePlanDetail(planId: string | null): UsePlanDetailResult {
  const [plan, setPlan] = useState<PlanWithGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!planId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<PlanWithGoals>>(`/annual-plans/${planId}`);
      setPlan(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plan");
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return { plan, loading, error };
}
