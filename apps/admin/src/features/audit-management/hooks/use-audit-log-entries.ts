"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";

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

export interface AuditLogFilters {
  action?: string;
  operatorId?: string;
  from?: string;
  to?: string;
  page?: number;
}

export interface AuditLogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseAuditLogEntriesResult {
  entries: AuditLogEntry[];
  pagination: AuditLogPagination | null;
  filters: AuditLogFilters;
  setFilters: (filters: AuditLogFilters) => void;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  exportCsv: () => void;
}

/** Human-readable labels for audit action codes. */
const ACTION_LABELS: Record<string, string> = {
  USER_CREATED: "Created user account",
  USER_UPDATED: "Updated user account",
  USER_DEACTIVATED: "Deactivated user account",
  USER_REACTIVATED: "Reactivated user account",
  SESSIONS_REVOKED: "Revoked user sessions",
  PASSWORD_RESET: "Reset password",
  BYPASS_ACTION: "Super admin bypass action",
};

export function formatAuditAction(action: string): string {
  return ACTION_LABELS[action] ?? action.replaceAll("_", " ").toLowerCase();
}

/** Known action codes for the filter dropdown (includes new PE actions). */
export const AUDIT_ACTION_FILTERS = [
  "",
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DEACTIVATED",
  "USER_REACTIVATED",
  "SESSIONS_REVOKED",
  "PASSWORD_RESET",
  "BYPASS_ACTION",
];

const PAGE_SIZE = 50;

function buildQuery(targetFilters: AuditLogFilters, limit: number): string {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (targetFilters.page) params.set("page", String(targetFilters.page));
  if (targetFilters.action) params.set("action", targetFilters.action);
  if (targetFilters.operatorId) params.set("operatorId", targetFilters.operatorId);
  if (targetFilters.from) params.set("from", targetFilters.from);
  if (targetFilters.to) params.set("to", targetFilters.to);
  return params.toString();
}

function auditErrorMessage(err: unknown): string {
  const code = (err as { error?: { code?: string } })?.error?.code;
  if (code === "FORBIDDEN") return "You do not have permission to view the audit trail.";
  if (err instanceof Error) return err.message;
  return "Failed to load audit logs";
}

/**
 * PE-05 / FR-13.10: filtered, paginated audit trail with CSV export.
 */
export function useAuditLogEntries(initialLimit = PAGE_SIZE): UseAuditLogEntriesResult {
  const [filters, setFilters] = useState<AuditLogFilters>({});

  const query = useQuery({
    queryKey: ["audit-logs", filters, initialLimit],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<AuditLogEntry[]> & { pagination?: AuditLogPagination }
      >(`/audit-logs?${buildQuery(filters, initialLimit)}`);
      return {
        entries: response.data ?? [],
        pagination: response.pagination ?? null,
      };
    },
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      const code = (error as { error?: { code?: string } })?.error?.code;
      if (code === "FORBIDDEN") return false;
      return failureCount < 1;
    },
  });

  /** Download the current filter selection as CSV (server-generated). */
  const exportCsv = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.open(
      `${base}/api/v1/audit-logs?${buildQuery({ ...filters, page: undefined }, 100)}&format=csv`,
      "_blank"
    );
  };

  return {
    entries: query.data?.entries ?? [],
    pagination: query.data?.pagination ?? null,
    filters,
    setFilters,
    loading: query.isPending || query.isFetching,
    error: query.isError ? auditErrorMessage(query.error) : null,
    refresh: () => {
      void query.refetch();
    },
    exportCsv,
  };
}
