"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { DistributionStatusItem } from "../../lib/types";

interface UseDistributionStatusResult {
  distributions: DistributionStatusItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDistributionStatus(planId: string | null): UseDistributionStatusResult {
  const [distributions, setDistributions] = useState<DistributionStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDistributions = useCallback(async () => {
    if (!planId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<DistributionStatusItem[]>>(
        `/annual-plans/${planId}/distributions`
      );
      setDistributions(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch distributions");
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchDistributions();
  }, [fetchDistributions]);

  return { distributions, loading, error, refresh: fetchDistributions };
}
