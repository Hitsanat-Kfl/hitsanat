"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { Pagination, PeriodicReport, ReportSubmission } from "@/lib/types";

interface UseReportsResult {
  reports: PeriodicReport[];
  submissions: ReportSubmission[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useReports(): UseReportsResult {
  const [reports, setReports] = useState<PeriodicReport[]>([]);
  const [submissions, setSubmissions] = useState<ReportSubmission[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportsRes, submissionsRes] = await Promise.all([
        api.get<{ success: boolean; data: PeriodicReport[]; pagination: Pagination }>(
          "/reports?limit=50"
        ),
        api.get<{ success: boolean; data: ReportSubmission[]; pagination: Pagination }>(
          "/reports/submissions/list?limit=50"
        ),
      ]);
      setReports(reportsRes.data);
      setSubmissions(submissionsRes.data);
      setPagination(reportsRes.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, submissions, pagination, loading, error, refresh: fetchReports };
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
