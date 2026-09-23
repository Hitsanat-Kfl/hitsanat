"use client";

import { useQuery } from "@tanstack/react-query";
import { type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { Assessment } from "@/domains/definitions";

interface UseAssessmentsResult {
  assessments: Assessment[];
  pagination: PaginatedResponse<Assessment>["pagination"] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAssessments(): UseAssessmentsResult {
  const query = useQuery({
    queryKey: ["academic", "assessments"],
    queryFn: async () => api.get<PaginatedResponse<Assessment>>("/academic/assessments?limit=50"),
  });

  return {
    assessments: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch assessments") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
