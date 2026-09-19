"use client";

import {
  Badge,
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { RefreshCw } from "lucide-react";
import { PageShell } from "@/features/shell";
import { formatAuditAction, useAuditLogEntries } from "../hooks/use-audit-log-entries";

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
  if (action === "USER_CREATED") return "default";
  if (action === "PASSWORD_RESET") return "secondary";
  return "outline";
}

export default function AuditLogsPage() {
  const { entries, loading, error, refresh } = useAuditLogEntries(100);

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Audit Logs" }]}
      title="Audit Logs"
      description="Track administrative actions across the system."
      actions={
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          Refresh
        </Button>
      }
    >
      <div className="space-y-4">
        {error && (
          <div role="alert" className="rounded-md bg-destructive/10 p-4 text-destructive">
            {error}
            <button type="button" onClick={refresh} className="ml-3 underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12" aria-busy="true">
            <Spinner size="lg" />
          </div>
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

            <p className="text-sm text-muted-foreground">
              Showing {entries.length} most recent entries.
            </p>
          </>
        )}
      </div>
    </PageShell>
  );
}
