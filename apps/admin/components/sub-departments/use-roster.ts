"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { SubDepartmentMember } from "../../lib/types";

interface UseRosterResult {
  members: SubDepartmentMember[];
  loading: boolean;
  error: string | null;
}

export function useRoster(code: string): UseRosterResult {
  const [members, setMembers] = useState<SubDepartmentMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoster = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse<SubDepartmentMember[]>>(
        `/sub-departments/${code}/roster`
      );
      setMembers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch roster");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  return { members, loading, error };
}
