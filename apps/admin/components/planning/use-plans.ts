"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, type PaginatedResponse, api } from "../../lib/api-client";
import type { AnnualMasterPlan, Pagination } from "../../lib/types";

interface UsePlansResult {
  plans: AnnualMasterPlan[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePlans(): UsePlansResult {
  const [plans, setPlans] = useState<AnnualMasterPlan[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await api.get<PaginatedResponse<AnnualMasterPlan>>("/annual-plans?limit=100");
      setPlans(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, pagination, loading, error, refresh: fetchPlans };
}
