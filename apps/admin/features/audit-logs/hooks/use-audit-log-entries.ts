"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "@/lib/api-client";

export interface AuditLogEntry {
  id: string;
  operatorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  payloadDiff: string | null;
  ipAddress: string | null;
  timestamp: string;
}

interface UseAuditLogEntriesResult {
  entries: AuditLogEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** Human-readable labels for audit action codes. */
const ACTION_LABELS: Record<string, string> = {
  USER_CREATED: "Created user account",
  USER_UPDATED: "Updated user account",
  USER_DEACTIVATED: "Deactivated user account",
  PASSWORD_RESET: "Reset password",
};

export function formatAuditAction(action: string): string {
  return ACTION_LABELS[action] ?? action.replaceAll("_", " ").toLowerCase();
}

export function useAuditLogEntries(limit = 50): UseAuditLogEntriesResult {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse<AuditLogEntry[]>>(`/audit-logs?limit=${limit}`);
      setEntries(response.data ?? []);
    } catch (err) {
      const code = (err as { error?: { code?: string } })?.error?.code;
      setError(
        code === "FORBIDDEN"
          ? "You do not have permission to view the audit trail."
          : err instanceof Error
            ? err.message
            : "Failed to load audit logs"
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    entries,
    loading,
    error,
    refresh: fetchLogs,
  };
}
