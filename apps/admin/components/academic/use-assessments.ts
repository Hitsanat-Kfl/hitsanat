"use client";

import { useCallback, useEffect, useState } from "react";
import { type PaginatedResponse, api } from "../../lib/api-client";
import type { Assessment } from "../../lib/types";

interface UseAssessmentsResult {
  assessments: Assessment[];
  pagination: PaginatedResponse<Assessment>["pagination"] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAssessments(): UseAssessmentsResult {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Assessment>["pagination"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PaginatedResponse<Assessment>>(
        "/academic/assessments?limit=50"
      );
      setAssessments(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assessments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  return { assessments, pagination, loading, error, refresh: fetchAssessments };
}
