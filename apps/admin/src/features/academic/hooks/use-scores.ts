"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { StudentScore } from "@/domains/definitions";

interface UseScoresResult {
  scores: StudentScore[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useScores(assessmentId: string): UseScoresResult {
  const query = useQuery({
    queryKey: ["academic", "assessments", assessmentId, "scores"],
    enabled: Boolean(assessmentId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<StudentScore[]>>(
        `/academic/assessments/${assessmentId}/scores`
      );
      return response.data;
    },
  });

  return {
    scores: query.data ?? [],
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch scores") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
