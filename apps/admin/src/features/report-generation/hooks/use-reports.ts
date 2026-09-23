"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { Pagination, PeriodicReport, ReportSubmission } from "@/domains/definitions";

interface UseReportsResult {
  reports: PeriodicReport[];
  submissions: ReportSubmission[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useReports(): UseReportsResult {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const [reportsRes, submissionsRes] = await Promise.all([
        api.get<{ success: boolean; data: PeriodicReport[]; pagination: Pagination }>(
          "/reports?limit=50"
        ),
        api.get<{ success: boolean; data: ReportSubmission[]; pagination: Pagination }>(
          "/reports/submissions/list?limit=50"
        ),
      ]);
      return {
        reports: reportsRes.data,
        submissions: submissionsRes.data,
        pagination: reportsRes.pagination,
      };
    },
  });

  return {
    reports: query.data?.reports ?? [],
    submissions: query.data?.submissions ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch reports") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}

export async function generateReport(data: {
  reportType: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  subDepartmentId?: string;
}): Promise<PeriodicReport> {
  const response = await api.post<{ success: boolean; data: PeriodicReport }>(
    "/reports/generate",
    data
  );
  return response.data;
}

export async function submitReport(data: {
  reportType: string;
  periodLabel: string;
  subDepartmentId: string;
  metrics?: Record<string, unknown>;
  challenges?: string;
  notes?: string;
}): Promise<ReportSubmission> {
  const response = await api.post<{ success: boolean; data: ReportSubmission }>(
    "/reports/submissions",
    data
  );
  return response.data;
}
