"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import type { AttendanceSession } from "../../lib/types";

interface TransportRecord {
  memberId: string;
  memberName: string;
  transportAssigned: boolean;
  transportType: string | null;
  transportNotes: string | null;
}

interface UseTransportResult {
  sessions: AttendanceSession[];
  transportRecords: TransportRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  assignTransport: (sessionId: string, records: TransportRecord[]) => Promise<void>;
}

export function useTransport(): UseTransportResult {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [transportRecords, setTransportRecords] = useState<TransportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ success: boolean; data: AttendanceSession[] }>(
        "/attendance/sessions?status=Completed&limit=50"
      );
      setSessions(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransportRecords = useCallback(async (sessionId: string) => {
    try {
      const response = await api.get<{ success: boolean; data: TransportRecord[] }>(
        `/attendance/sessions/${sessionId}/transport`
      );
      setTransportRecords(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transport records");
    }
  }, []);

  const assignTransport = useCallback(
    async (sessionId: string, records: TransportRecord[]) => {
      try {
        await api.post(`/attendance/sessions/${sessionId}/transport`, { records });
        await fetchTransportRecords(sessionId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to assign transport");
        throw err;
      }
    },
    [fetchTransportRecords]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, transportRecords, loading, error, refresh: fetchSessions, assignTransport };
}
