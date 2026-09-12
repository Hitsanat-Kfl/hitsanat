"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { SubDepartment } from "../../lib/types";

interface UseSubDepartmentsResult {
  departments: SubDepartment[];
  loading: boolean;
  error: string | null;
}

export function useSubDepartments(): UseSubDepartmentsResult {
  const [departments, setDepartments] = useState<SubDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse<SubDepartment[]>>("/sub-departments");
      setDepartments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error };
}
