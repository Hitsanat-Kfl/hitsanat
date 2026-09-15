"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { SubDeptDashboard } from "../../lib/types";

interface UseSubDeptDashboardResult {
  dashboard: SubDeptDashboard | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSubDeptDashboard(code: string): UseSubDeptDashboardResult {
  const [dashboard, setDashboard] = useState<SubDeptDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<SubDeptDashboard>>(
        `/sub-departments/${code}/dashboard`
      );
      setDashboard(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refresh: fetchDashboard };
}
