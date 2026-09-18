"use client";

import { useCallback, useEffect, useState } from "react";
import type { ActivityItem } from "@repo/ui";
import { type ApiResponse, api } from "@/lib/api-client";

/** Mirror of the audit module's AuditLog entity. */
export interface AuditEntry {
  id: string;
  operatorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  payloadDiff: string | null;
  ipAddress: string | null;
  timestamp: string;
}

interface UseAuditLogsResult {
  activity: ActivityItem[];
  entries: AuditEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** Human-readable verb per audit action code. */
const ACTION_LABELS: Record<string, string> = {
  USER_CREATED: "created user account",
  USER_UPDATED: "updated user account",
  USER_DEACTIVATED: "deactivated user account",
  PASSWORD_RESET: "reset password for",
};

function toActivity(entry: AuditEntry): ActivityItem {
  const action = ACTION_LABELS[entry.action] ?? entry.action.toLowerCase().replaceAll("_", " ");
  // payloadDiff carries "email=...; role=..." — extract the email for the entity label.
  const emailMatch = entry.payloadDiff?.match(/email=([^;]+)/);
  const entity = emailMatch?.[1] ?? entry.resourceId;

  return {
    id: entry.id,
    actor: entry.operatorId,
    action,
    entity,
    timestamp: new Date(entry.timestamp).toLocaleString("en-ET", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    status: entry.action === "USER_DEACTIVATED" ? "destructive" : "default",
  };
}

/**
 * Recent administrative activity for the Super Admin dashboard, sourced
 * from the real audit trail (GET /audit-logs). No fabricated events.
 */
export function useAuditLogs(limit = 8): UseAuditLogsResult {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse<AuditEntry[]>>(`/audit-logs?limit=${limit}`);
      setEntries(response.data ?? []);
    } catch (err) {
      const code = (err as { error?: { code?: string } })?.error?.code;
      setError(
        code === "FORBIDDEN"
          ? "You do not have permission to view the audit trail."
          : err instanceof Error
            ? err.message
            : "Failed to load audit activity"
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    activity: entries.map(toActivity),
    entries,
    loading,
    error,
    refresh: fetchLogs,
  };
}
