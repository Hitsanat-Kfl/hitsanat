"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { AttendanceSession } from "@/domains/definitions";

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
  const [transportRecords, setTransportRecords] = useState<TransportRecord[]>([]);

  const sessionsQuery = useQuery({
    queryKey: ["attendance", "sessions", "completed"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: AttendanceSession[] }>(
        "/attendance/sessions?status=Completed&limit=50"
      );
      return response.data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({
      sessionId,
      records,
    }: {
      sessionId: string;
      records: TransportRecord[];
    }) => {
      await api.post(`/attendance/sessions/${sessionId}/transport`, { records });
      const response = await api.get<{ success: boolean; data: TransportRecord[] }>(
        `/attendance/sessions/${sessionId}/transport`
      );
      return response.data;
    },
    onSuccess: (data) => {
      setTransportRecords(data);
    },
  });

  const assignTransport = async (sessionId: string, records: TransportRecord[]) => {
    try {
      await assignMutation.mutateAsync({ sessionId, records });
    } catch (err) {
      throw new Error(queryErrorMessage(err, "Failed to assign transport"));
    }
  };

  return {
    sessions: sessionsQuery.data ?? [],
    transportRecords,
    loading: sessionsQuery.isPending || sessionsQuery.isFetching,
    error: sessionsQuery.isError
      ? queryErrorMessage(sessionsQuery.error, "Failed to fetch sessions")
      : null,
    refresh: () => {
      void sessionsQuery.refetch();
    },
    assignTransport,
  };
}
