"use client";

import {
  Badge,
  Button,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { Download, RefreshCw } from "lucide-react";
import { AlertBanner, PageLoading, PagePagination, PageShell } from "@/widgets/shell";
import { ActorPicker } from "./actor-picker";
import {
  AUDIT_ACTION_FILTERS,
  formatAuditAction,
  useAuditLogEntries,
} from "../hooks/use-audit-log-entries";

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-ET", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function actionBadgeVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
  if (action === "USER_DEACTIVATED") return "destructive";
  if (action === "USER_CREATED" || action === "USER_REACTIVATED") return "default";
  if (action === "PASSWORD_RESET" || action === "SESSIONS_REVOKED") return "secondary";
  if (action === "BYPASS_ACTION") return "destructive";
  return "outline";
}

/**
 * PE-05 / FR-13.10: audit trail with filters (action, actor, date range),
 * server-side pagination, and CSV export for incident review.
 */
export default function AuditLogsPage() {
  const { entries, pagination, filters, setFilters, loading, error, refresh, exportCsv } =
    useAuditLogEntries();

  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Audit Logs" }]}
      title="Audit Logs"
      description="Track administrative actions across the system."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* PE-05 filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select
            value={filters.action ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, action: e.target.value || undefined, page: 1 })
            }
            aria-label="Filter by action"
            className="sm:max-w-56"
          >
            {AUDIT_ACTION_FILTERS.map((action) => (
              <option key={action || "all"} value={action}>
                {action ? formatAuditAction(action) : "All actions"}
              </option>
            ))}
          </Select>
          <ActorPicker
            value={filters.operatorId ?? null}
            onChange={(actor) => setFilters({ ...filters, operatorId: actor?.id, page: 1 })}
          />
          <Input
            type="date"
            value={filters.from ?? ""}
            onChange={(e) => setFilters({ ...filters, from: e.target.value || undefined, page: 1 })}
            aria-label="From date"
            className="sm:max-w-40"
          />
          <Input
            type="date"
            value={filters.to ?? ""}
            onChange={(e) => setFilters({ ...filters, to: e.target.value || undefined, page: 1 })}
            aria-label="To date"
            className="sm:max-w-40"
          />
        </div>

        {error && <AlertBanner message={error} />}

        {loading ? (
          <PageLoading aria-busy="true" />
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="hidden sm:table-cell">IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No audit logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Badge variant={actionBadgeVariant(entry.action)}>
                            {formatAuditAction(entry.action)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {entry.resourceType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className="max-w-xs truncate text-sm"
                            title={entry.payloadDiff ?? ""}
                          >
                            {entry.payloadDiff ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {entry.ipAddress ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(entry.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {pagination ? `${pagination.total} entr(ies)` : `${entries.length} entries`}
              </span>
              <PagePagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
