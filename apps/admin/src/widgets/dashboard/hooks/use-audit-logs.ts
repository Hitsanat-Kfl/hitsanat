"use client";

import { useQuery } from "@tanstack/react-query";
import type { ActivityItem } from "@repo/ui";
import { type ApiResponse, api } from "@/infrastructure/api/client";

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
  USER_REACTIVATED: "reactivated user account",
  SESSIONS_REVOKED: "revoked sessions for",
  BYPASS_ACTION: "performed bypass action on",
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

function auditErrorMessage(err: unknown): string {
  const code = (err as { error?: { code?: string } })?.error?.code;
  if (code === "FORBIDDEN") return "You do not have permission to view the audit trail.";
  if (err instanceof Error) return err.message;
  return "Failed to load audit activity";
}

/**
 * Recent administrative activity for the Super Admin dashboard, sourced
 * from the real audit trail (GET /audit-logs). No fabricated events.
 */
export function useAuditLogs(limit = 8): UseAuditLogsResult {
  const query = useQuery({
    queryKey: ["audit-logs", "widget", limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AuditEntry[]>>(`/audit-logs?limit=${limit}`);
      return response.data ?? [];
    },
    retry: (failureCount, error) => {
      const code = (error as { error?: { code?: string } })?.error?.code;
      if (code === "FORBIDDEN") return false;
      return failureCount < 1;
    },
  });

  const entries = query.data ?? [];

  return {
    activity: entries.map(toActivity),
    entries,
    loading: query.isPending || query.isFetching,
    error: query.isError ? auditErrorMessage(query.error) : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
