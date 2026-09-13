"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import type { AttendanceRecord, AttendanceSession, Pagination } from "../../lib/types";

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
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.subDepartmentId) params.set("subDepartmentId", filters.subDepartmentId);
      if (filters?.status) params.set("status", filters.status);
      params.set("limit", "50");
      const query = params.toString();
      const response = await api.get<{
        success: boolean;
        data: AttendanceSession[];
        pagination: Pagination;
      }>(`/attendance/sessions${query ? `?${query}` : ""}`);
      setSessions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  }, [filters?.subDepartmentId, filters?.status]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, pagination, loading, error, refresh: fetchSessions };
}

interface UseSessionDetailResult {
  session: AttendanceSession | null;
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSessionDetail(sessionId: string): UseSessionDetailResult {
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionRes = await api.get<{ success: boolean; data: AttendanceSession }>(
        `/attendance/sessions/${sessionId}`
      );
      setSession(sessionRes.data);

      const recordsRes = await api.get<{ success: boolean; data: AttendanceRecord[] }>(
        `/attendance/sessions/${sessionId}/records`
      );
      setRecords(recordsRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch session detail");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { session, records, loading, error, refresh: fetchDetail };
}
