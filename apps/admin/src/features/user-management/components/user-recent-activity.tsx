import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import {
  formatAuditAction,
  useUserActivity,
} from "@/features/audit-management/hooks/use-audit-log-entries";
import { Panel, SectionTitle } from "./user-detail-sections";
import { formatDateTime } from "./user-shared";

function actionVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
  if (action === "USER_DEACTIVATED" || action === "BYPASS_ACTION") return "destructive";
  if (action === "USER_CREATED" || action === "USER_REACTIVATED") return "default";
  if (action === "PASSWORD_RESET" || action === "SESSIONS_REVOKED") return "secondary";
  return "outline";
}

interface UserRecentActivityProps {
  /** Actor filter — the account's own audit trail. */
  operatorId: string | null;
  limit?: number;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  titleId?: string;
}

/**
 * The account's own audit trail, filtered by `operatorId` — the exact same
 * rows the Audit Logs page shows, so the two screens stay consistent.
 *
 * Always fetched (including for read-only viewers) because the trail is
 * read-only and permission-safe: a forbidden response degrades to an empty
 * list rather than an error.
 */
export function UserRecentActivity({
  operatorId,
  limit = 10,
  title = "Recent Activity",
  subtitle,
  showViewAll = true,
  titleId = "user-recent-activity-title",
}: UserRecentActivityProps) {
  const { entries, loading, error, refresh } = useUserActivity(operatorId, limit);

  return (
    <Panel titleId={titleId}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <SectionTitle id={titleId}>{title}</SectionTitle>
          {subtitle && <p className="mt-1.5 text-[13px] text-muted-foreground">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link
            href="/audit-logs"
            className="shrink-0 text-xs font-medium text-[#5F0113] transition-colors hover:underline hover:underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View All
          </Link>
        )}
      </div>

      {loading && (
        <div className="mt-4 space-y-3" aria-busy="true">
          <span className="sr-only">Loading activity…</span>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-4 w-28 shrink-0 rounded bg-muted" />
              <div className="h-4 flex-1 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="mt-4 rounded-md border border-[#E5E7EB] bg-[#F7F8F9] p-3">
          <p className="text-sm text-foreground">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={refresh}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="mt-4 border-t border-[#F1F3F5] pt-4">
          <p className="text-sm font-medium text-foreground">No activity recorded yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Actions performed with this account will appear here.
          </p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <>
          {/* Desktop table — mirrors the Audit Logs page column set. */}
          <div className="mt-4 hidden rounded-md border border-[#E5E7EB] md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date &amp; Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
                      {formatDateTime(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={actionVariant(entry.action)}>
                        {formatAuditAction(entry.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.resourceType}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {entry.resourceId}
                    </TableCell>
                    <TableCell>
                      <span
                        className="block max-w-xs truncate text-sm"
                        title={entry.payloadDiff ?? ""}
                      >
                        {entry.payloadDiff ?? "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile list — one activity row per line group. */}
          <ul className="mt-4 divide-y divide-[#F1F3F5] border-t border-[#F1F3F5] md:hidden">
            {entries.map((entry) => (
              <li key={entry.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <Badge variant={actionVariant(entry.action)}>
                    {formatAuditAction(entry.action)}
                  </Badge>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatDateTime(entry.timestamp)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {entry.resourceType}
                  <span className="mx-1.5" aria-hidden="true">
                    ·
                  </span>
                  <span className="font-mono">{entry.resourceId}</span>
                </p>
                {entry.payloadDiff && (
                  <p className="mt-1 text-sm text-foreground">{entry.payloadDiff}</p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}
