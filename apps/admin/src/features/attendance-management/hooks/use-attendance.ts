"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { AttendanceRecord, AttendanceSession, Pagination } from "@/domains/definitions";

interface UseAttendanceResult {
  sessions: AttendanceSession[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAttendanceSessions(filters?: {
  subDepartmentId?: string;
  status?: string;
}): UseAttendanceResult {
  const subDepartmentId = filters?.subDepartmentId;
  const status = filters?.status;

  const query = useQuery({
    queryKey: ["attendance", "sessions", { subDepartmentId, status }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (subDepartmentId) params.set("subDepartmentId", subDepartmentId);
      if (status) params.set("status", status);
      params.set("limit", "50");
      const q = params.toString();
      return api.get<{
        success: boolean;
        data: AttendanceSession[];
        pagination: Pagination;
      }>(`/attendance/sessions${q ? `?${q}` : ""}`);
    },
  });

  return {
    sessions: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch sessions") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}

interface UseSessionDetailResult {
  session: AttendanceSession | null;
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSessionDetail(sessionId: string): UseSessionDetailResult {
  const query = useQuery({
    queryKey: ["attendance", "sessions", sessionId, "detail"],
    enabled: Boolean(sessionId),
    queryFn: async () => {
      const sessionRes = await api.get<{ success: boolean; data: AttendanceSession }>(
        `/attendance/sessions/${sessionId}`
      );
      const recordsRes = await api.get<{ success: boolean; data: AttendanceRecord[] }>(
        `/attendance/sessions/${sessionId}/records`
      );
      return { session: sessionRes.data, records: recordsRes.data };
    },
  });

  return {
    session: query.data?.session ?? null,
    records: query.data?.records ?? [],
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch session detail") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
