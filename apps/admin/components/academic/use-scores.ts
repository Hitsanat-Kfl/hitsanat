"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { StudentScore } from "../../lib/types";

interface UseScoresResult {
  scores: StudentScore[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useScores(assessmentId: string): UseScoresResult {
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    if (!assessmentId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<StudentScore[]>>(
        `/academic/assessments/${assessmentId}/scores`
      );
      setScores(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch scores");
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return { scores, loading, error, refresh: fetchScores };
}
