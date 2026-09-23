"use client";

import { PageShell } from "@/features/shell";
import { api } from "@/lib/api-client";
import { Skeleton } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import {
  AlertTriangle,
  Activity,
  Baby,
  ChevronRight,
  ClipboardList,
  FileText,
  KeyRound,
  Layers,
  LayoutGrid,
  UserCog,
  Users,
  UsersRound,
  UserX,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useAuditLogs } from "../hooks/use-audit-logs";
import {
  type AdminUserRow,
  type QuickActionIconKey,
  type RosterEntry,
  type SuperAdminQuickAction,
  useSuperAdminDashboard,
} from "../hooks/use-super-admin-dashboard";

// ============================================================
// Design tokens — Design System v1.0 brand values (exact).
// ============================================================

const T = {
  burgundy: "#5F0113",
  burgundyPale: "#F8EEF2",
  gold: "#F3C913",
  foreground: "#182235",
  /** Snapshot heading/number/label tone per the reference card spec. */
  heading: "#19304A",
  secondary: "#667085",
  border: "#E5E7EB",
  mutedSurface: "#F7F8F9",
  success: "#16834A",
  warning: "#B7791F",
  destructive: "#B42318",
} as const;

const QUICK_ACTION_ICONS: Record<QuickActionIconKey, LucideIcon> = {
  users: UserCog,
  "audit-logs": FileText,
  permissions: KeyRound,
  members: Users,
  children: Baby,
  "sub-departments": Layers,
};

const ROLE_BADGE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  CHAIRPERSON: "Chairperson",
  SUB_CHAIRPERSON: "Sub-Chairperson",
  SECRETARY: "Secretary",
};

function roleBadgeLabel(role: string): string {
  return ROLE_BADGE_LABELS[role] ?? role;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Compact relative time for the Recent Accounts list. */
function relativeTime(value: string | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  const diffMs = Date.now() - parsed.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return parsed.toLocaleDateString("en-ET", { month: "short", day: "numeric" });
}

/** Human-readable verb per audit action code (mirrors audit-logs feature display). */
const AUDIT_ACTION_LABELS: Record<string, string> = {
  USER_CREATED: "created user account",
  USER_UPDATED: "updated user account",
  USER_DEACTIVATED: "deactivated user account",
  USER_REACTIVATED: "reactivated user account",
  SESSIONS_REVOKED: "revoked sessions for",
  BYPASS_ACTION: "performed bypass action on",
  PASSWORD_RESET: "reset password for",
};

function auditActionLabel(action: string): string {
  return AUDIT_ACTION_LABELS[action] ?? action.toLowerCase().replaceAll("_", " ");
}

/** payloadDiff carries "email=...; role=..." — extract the email for the details column. */
function auditEntityLabel(entry: { payloadDiff: string | null; resourceId: string }): string {
  const emailMatch = entry.payloadDiff?.match(/email=([^;]+)/);
  return emailMatch?.[1] ?? entry.resourceId;
}

/** Time-of-day label for audit entries (e.g. "10:42 AM", "Yesterday", "Sep 20, 2026"). */
function auditTimeLabel(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (parsed.getTime() >= startOfToday) {
    return parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  const startOfYesterday = startOfToday - 86400000;
  if (parsed.getTime() >= startOfYesterday) return "Yesterday";
  return parsed.toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" });
}

// ============================================================
// Shared primitives — white surface, hairline #E5E7EB border,
// 8px radius, no shadows (borders over elevation).
// ============================================================

function Widget({
  title,
  icon: Icon,
  action,
  children,
  className = "",
  id,
}: {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`flex flex-col overflow-hidden rounded-lg border bg-card ${className}`}
      style={{ borderColor: T.border }}
      aria-label={title}
    >
      {/* Common card header: [ICON] TITLE — ACTION (reference card spec). */}
      <header
        className="flex min-h-[48px] items-center justify-between gap-2 border-b px-5 py-3"
        style={{ borderColor: T.border }}
      >
        <h2
          className="flex items-center gap-2 text-[15px] font-semibold"
          style={{ color: T.foreground }}
        >
          {Icon && (
            <Icon
              className="h-[18px] w-[18px] shrink-0"
              style={{ color: T.secondary }}
              aria-hidden="true"
            />
          )}
          {title}
        </h2>
        {action}
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}

function ViewAll({ href, label = "View all" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-[12px] font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ color: T.secondary }}
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${className}`}
      style={{ color: T.secondary }}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td
      className={`whitespace-nowrap px-5 py-2.5 text-[13px] ${className}`}
      style={{ color: T.foreground }}
    >
      {children}
    </td>
  );
}

function StatusDot({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span style={{ color }}>{children}</span>
    </span>
  );
}

function RolePill({ role }: { role: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-4"
      style={{
        backgroundColor: T.mutedSurface,
        border: `1px solid ${T.border}`,
        color: T.secondary,
      }}
    >
      {roleBadgeLabel(role)}
    </span>
  );
}

function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 px-5 py-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
        <Skeleton key={`row-${i}`} className="h-8 w-full" />
      ))}
    </div>
  );
}

function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 px-5 py-6 text-center">
      <p className="text-[13px]" style={{ color: T.secondary }}>
        {children}
      </p>
    </div>
  );
}

function WidgetErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 px-5 py-5 text-center">
      <p className="text-[13px]" style={{ color: T.destructive }}>
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-[11px] font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ color: T.secondary }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2 px-5 py-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
        <Skeleton key={`li-${i}`} className="h-6 w-full" />
      ))}
    </div>
  );
}

// ============================================================
// Page header — eyebrow + title + description (§4).
// ============================================================

function PageHeader() {
  return (
    <header className="mb-5">
      <p
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: T.secondary }}
      >
        Super Admin
      </p>
      <h1
        className="mt-1 text-[24px] font-bold leading-tight tracking-tight sm:text-[26px]"
        style={{ color: T.foreground }}
      >
        System Overview
      </h1>
      <p className="mt-0.5 text-[13px]" style={{ color: T.secondary }}>
        Manage the organization, users and system settings.
      </p>
    </header>
  );
}

// ============================================================
// Hero banner — muted community photograph + institutional
// motto with gold accent (§5). 110–130px tall, never a hero.
// ============================================================

function HeroBanner() {
  return (
    <div
      className="relative h-[120px] overflow-hidden rounded-lg border"
      style={{ borderColor: T.border }}
      role="img"
      aria-label="Community gathering at the ministry hall"
    >
      {/* Photo: muted community hall scene (local SVG asset). */}
      <img
        src="/hero-banner.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Institutional motto with gold accent under the primary phrase. */}
      <div className="absolute inset-0 flex items-center px-5 sm:px-6">
        <div>
          <p className="text-[13px] font-medium tracking-wide text-white/90 sm:text-[14px]">
            Faith&ensp;&middot;&ensp;Service&ensp;&middot;&ensp;Community
          </p>
          <span
            className="mt-1.5 block h-[2px] w-16 rounded-full"
            style={{ backgroundColor: T.gold }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// System snapshot — ONE administrative surface, four columns
// with vertical dividers (§7). No floating metric cards.
// ============================================================

function SnapshotColumn({
  value,
  label,
  supporting,
  icon: Icon,
  loading,
}: {
  value: string;
  label: string;
  supporting: string;
  icon: LucideIcon;
  loading?: boolean;
  /** Kept for API stability — partial failures render "—" + "Unavailable". */
  unavailable?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1.5 px-3 first:pl-0 last:pr-0 sm:px-6">
      {/* 22px muted outline icon — secondary to the number (§metric icon). */}
      <Icon
        className="h-[22px] w-[22px] shrink-0"
        style={{ color: T.secondary }}
        aria-hidden="true"
      />
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <span
          className="text-[30px] font-bold leading-[1.1] tracking-tight tabular-nums"
          style={{ color: T.heading }}
        >
          {value}
        </span>
      )}
      <span className="text-[13px] font-medium" style={{ color: T.heading }}>
        {label}
      </span>
      <span className="text-[12px]" style={{ color: T.secondary }}>
        {supporting}
      </span>
    </div>
  );
}

function SystemSnapshot({
  totalAccounts,
  activeAccounts,
  deactivatedCount,
  memberTotal,
  childrenTotal,
  subDepartmentCount,
  loading,
  membersUnavailable,
  childrenUnavailable,
}: {
  totalAccounts: number;
  activeAccounts: number;
  deactivatedCount: number;
  memberTotal: number | null;
  childrenTotal: number | null;
  subDepartmentCount: number;
  loading: boolean;
  membersUnavailable: boolean;
  childrenUnavailable: boolean;
}) {
  return (
    <section
      className="min-h-[150px] rounded-lg border bg-card"
      style={{ borderColor: T.border }}
      aria-label="System Snapshot"
      aria-busy={loading}
    >
      {/* Unified card body: 26px horizontal padding, heading inside the card
          with the gold accent, then the 4-column metric grid (§Row 2 spec). */}
      <div className="px-4 py-[18px] sm:px-[26px] sm:py-5">
        <div className="flex items-center gap-2.5">
          <h2
            className="text-[12px] font-semibold uppercase"
            style={{ color: T.heading, letterSpacing: "0.08em" }}
          >
            System Snapshot
          </h2>
          <span
            className="h-[2px] w-6 rounded-full"
            style={{ backgroundColor: T.gold }}
            aria-hidden="true"
          />
        </div>
        {/* ~20px heading→metrics spacing (§header→metrics). */}
        <div className="mt-5 grid grid-cols-2 sm:mt-5 sm:grid-cols-4">
          <SnapshotColumn
            value={String(totalAccounts)}
            label="User Accounts"
            supporting={`${activeAccounts} active · ${deactivatedCount} deactivated`}
            icon={UserCog}
            loading={loading}
          />
          <SnapshotColumn
            value={memberTotal === null ? "—" : String(memberTotal)}
            label="Members"
            supporting={membersUnavailable ? "Unavailable" : "registered"}
            icon={Users}
            loading={loading}
          />
          <SnapshotColumn
            value={childrenTotal === null ? "—" : String(childrenTotal)}
            label="Children"
            supporting={childrenUnavailable ? "Unavailable" : "registered"}
            icon={Baby}
            loading={loading}
          />
          <SnapshotColumn
            value={String(subDepartmentCount)}
            label="Sub-Departments"
            supporting="active"
            icon={Layers}
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Administrative work — 3 rows, first row emphasized with a
// pale burgundy wash and burgundy indicator (§9).
// ============================================================

function AdminWorkRow({
  count,
  title,
  explanation,
  href,
  emphasized = false,
}: {
  count: number;
  title: string;
  explanation: string;
  href: string;
  emphasized?: boolean;
}) {
  return (
    <li className="border-b last:border-b-0" style={{ borderColor: T.border }}>
      <Link
        href={href}
        className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        style={emphasized ? { backgroundColor: T.burgundyPale } : undefined}
      >
        <span
          className="w-[3px] shrink-0 self-stretch rounded-full"
          style={{ backgroundColor: emphasized ? T.burgundy : "transparent" }}
          aria-hidden="true"
        />
        <span
          className="w-9 shrink-0 text-[22px] font-semibold tabular-nums leading-none"
          style={{ color: emphasized ? T.burgundy : T.foreground }}
        >
          {String(count).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold" style={{ color: T.foreground }}>
            {title}
          </span>
          <span className="block truncate text-[12px]" style={{ color: T.secondary }}>
            {explanation}
          </span>
        </span>
        <ChevronRight
          className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: T.secondary }}
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

function AdministrativeWork({
  deactivatedCount,
  conflictCount,
  unassignedCount,
  unassignedLabel,
}: {
  deactivatedCount: number;
  conflictCount: number;
  unassignedCount: number;
  unassignedLabel: string;
}) {
  return (
    <Widget
      title="Administrative Work"
      icon={ClipboardList}
      action={<ViewAll href="/users" />}
      id="administrative-work"
    >
      <ul aria-label="Administrative work items">
        <AdminWorkRow
          count={deactivatedCount}
          title="Accounts requiring review"
          explanation="Deactivated accounts awaiting review"
          href="/users"
          emphasized
        />
        <AdminWorkRow
          count={conflictCount}
          title="Leadership assignments"
          explanation="Require administrative attention"
          href="/permissions"
        />
        <AdminWorkRow
          count={unassignedCount}
          title="Unassigned leadership post"
          explanation={unassignedLabel}
          href="/sub-departments"
        />
      </ul>
    </Widget>
  );
}

// ============================================================
// Leadership roster — compact table, text indicators (§10).
// ============================================================

function LeadershipRoster({ roster, loading }: { roster: RosterEntry[]; loading: boolean }) {
  return (
    <Widget title="Leadership Roster" icon={UsersRound} id="leadership-roster">
      {loading ? (
        <TableSkeleton rows={5} />
      ) : roster.length === 0 ? (
        <EmptyHint>No leadership posts configured yet.</EmptyHint>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ backgroundColor: T.mutedSurface }}>
                <Th>Post</Th>
                <Th>Holder</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {roster.map((entry) => {
                const assigned = entry.status !== "UNASSIGNED";
                return (
                  <tr
                    key={entry.userId}
                    className={cn("border-t", assigned && "transition-colors hover:bg-muted/30")}
                    style={{ borderColor: T.border }}
                  >
                    <Td>
                      <span className="inline-flex items-center gap-1.5">
                        {entry.conflict && (
                          <AlertTriangle
                            className="h-3 w-3 shrink-0"
                            style={{ color: T.warning }}
                            aria-label="BR-009 conflict"
                          />
                        )}
                        {entry.posts.join(" · ")}
                      </span>
                    </Td>
                    <Td>
                      {assigned ? (
                        // Click-through to the account holder's User Details (§32).
                        <Link
                          href={`/users/${entry.userId}`}
                          className="font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                        >
                          {entry.name}
                        </Link>
                      ) : (
                        <span style={{ color: T.secondary }}>—</span>
                      )}
                    </Td>
                    <Td>
                      {entry.status === "UNASSIGNED" ? (
                        <StatusDot color={T.secondary}>Unassigned</StatusDot>
                      ) : entry.status === "ACTIVE" ? (
                        <StatusDot color={T.success}>Active</StatusDot>
                      ) : (
                        <StatusDot color={T.destructive}>Deactivated</StatusDot>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Widget>
  );
}

// ============================================================
// Recent accounts — vertical list with subtle initials
// avatars, role badges, relative time (§11).
// ============================================================

function RecentAccounts({
  accounts,
  loading,
  error,
  onRetry,
}: {
  accounts: AdminUserRow[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <Widget
      title="Recent Accounts"
      icon={Users}
      action={<ViewAll href="/users" />}
      id="recent-accounts"
    >
      {loading ? (
        <ListSkeleton rows={5} />
      ) : error ? (
        <WidgetErrorState message={error} onRetry={onRetry} />
      ) : accounts.length === 0 ? (
        <EmptyHint>No accounts provisioned yet.</EmptyHint>
      ) : (
        <ul className="divide-y" style={{ borderColor: T.border }}>
          {accounts.map((user) => (
            <li key={user.id}>
              <Link
                href={`/users/${user.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{
                    backgroundColor: T.mutedSurface,
                    border: `1px solid ${T.border}`,
                    color: T.foreground,
                  }}
                  aria-hidden="true"
                >
                  {initialsOf(user.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className="block truncate text-[13px] font-medium"
                    style={{ color: T.foreground }}
                  >
                    {user.name}
                  </span>
                  <span className="block truncate text-[12px]" style={{ color: T.secondary }}>
                    {user.email}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <RolePill role={user.role} />
                  <span className="text-[11px]" style={{ color: T.secondary }}>
                    {relativeTime(user.createdAt)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Widget>
  );
}

// ============================================================
// Recent activity — dense TIME / EVENT / USER / DETAILS table
// with small status dots (§12).
// ============================================================

function RecentActivity({
  entries,
  loading,
  error,
  onRetry,
  userNameById,
}: {
  entries: Array<{
    id: string;
    operatorId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    payloadDiff: string | null;
    ipAddress: string | null;
    timestamp: string;
  }>;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  userNameById: Record<string, string>;
}) {
  return (
    <Widget
      title="Recent Activity"
      icon={Activity}
      action={<ViewAll href="/audit-logs" label="View audit log" />}
      id="recent-activity"
    >
      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <WidgetErrorState message={error} onRetry={onRetry} />
      ) : entries.length === 0 ? (
        <EmptyHint>Nothing to report yet.</EmptyHint>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ backgroundColor: T.mutedSurface }}>
                <Th className="w-[120px]">Time</Th>
                <Th>Event</Th>
                <Th>User</Th>
                <Th>Details</Th>
              </tr>
            </thead>
            <tbody>
              {" "}
              {entries.slice(0, 6).map((item) => {
                const isWarning =
                  item.action === "USER_DEACTIVATED" || item.action === "BYPASS_ACTION";
                return (
                  <tr
                    key={item.id}
                    className="border-t transition-colors hover:bg-muted/30"
                    style={{ borderColor: T.border }}
                  >
                    <Td className="tabular-nums">
                      <Link
                        href="/audit-logs"
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      >
                        {auditTimeLabel(item.timestamp)}
                      </Link>
                    </Td>
                    <Td>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: isWarning ? T.destructive : T.success }}
                          aria-hidden="true"
                        />
                        {auditActionLabel(item.action)}
                      </span>
                    </Td>
                    <Td>{userNameById[item.operatorId] ?? item.operatorId}</Td>
                    <Td>{auditEntityLabel(item)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Widget>
  );
}

// ============================================================
// Frequent administration — 2x3 grid of small navigation
// tiles (§13).
// ============================================================

function QuickActionTile({ action }: { action: SuperAdminQuickAction }) {
  const Icon = QUICK_ACTION_ICONS[action.icon];
  return (
    <Link
      href={action.href}
      className="group flex flex-col items-start gap-2 rounded-lg border bg-card p-3.5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ borderColor: T.border }}
    >
      <Icon className="h-[18px] w-[18px]" style={{ color: T.secondary }} aria-hidden="true" />
      <span className="text-[12px] font-semibold" style={{ color: T.foreground }}>
        {action.title}
      </span>
      <span className="hidden text-[11px] sm:block" style={{ color: T.secondary }}>
        {action.description}
      </span>
    </Link>
  );
}

function FrequentAdministration({ quickActions }: { quickActions: SuperAdminQuickAction[] }) {
  return (
    <Widget title="Frequent Administration" icon={LayoutGrid} id="frequent-administration">
      <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <QuickActionTile key={action.id} action={action} />
        ))}
      </div>
    </Widget>
  );
}

// ============================================================
// System status panel — right rail, informational (§6).
// ============================================================

function SystemStatusPanel({
  health,
  healthError,
  checkedAt,
}: {
  health: { status: string; version: string; environment: string } | null;
  healthError: string | null;
  checkedAt: string | null;
}) {
  const operational = health !== null;
  const lastChecked = checkedAt ? relativeTime(checkedAt) : operational ? "just now" : "—";

  return (
    <section
      className="h-fit rounded-lg border bg-card"
      style={{ borderColor: T.border }}
      aria-label="System Status"
      data-testid="api-status-tile"
    >
      <header className="border-b px-5 py-3" style={{ borderColor: T.border }}>
        <h2
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: T.secondary }}
        >
          System Status
        </h2>
      </header>
      <div className="px-5 py-4">
        {healthError && !operational ? (
          <p className="text-[12px]" style={{ color: T.destructive }} role="alert">
            {healthError}
          </p>
        ) : !operational ? (
          <div className="space-y-3" aria-busy="true" data-testid="system-status-skeleton">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <>
            <StatusDot color={T.success}>Operational</StatusDot>
            <dl className="mt-3">
              {[
                { term: "API", detail: "Available" },
                { term: "Environment", detail: health.environment },
                { term: "Version", detail: `v${health.version}` },
              ].map((row) => (
                <div
                  key={row.term}
                  className="flex items-center justify-between gap-2 border-t py-2 text-[12px] first:border-t-0"
                  style={{ borderColor: T.border }}
                >
                  <dt
                    className="font-medium uppercase tracking-wide"
                    style={{ color: T.secondary }}
                  >
                    {row.term}
                  </dt>
                  <dd style={{ color: T.foreground }}>{row.detail}</dd>
                </div>
              ))}
            </dl>
            <p
              className="border-t pt-2 text-[11px]"
              style={{ borderColor: T.border, color: T.secondary }}
            >
              Last checked {lastChecked}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

// ============================================================
// Super Admin Dashboard — reference layout.
// ============================================================

export function SuperAdminDashboardPage() {
  const {
    totalAccounts,
    activeAccounts,
    loadedAccounts,
    deactivatedAccounts,
    recentAccounts,
    leadershipRoster,
    rosterConflicts,
    unassignedPosts,
    memberTotal,
    childrenTotal,
    subDepartmentCount,
    userNameById,
    health,
    healthError,
    healthCheckedAt,
    membersError,
    childrenError,
    quickActions,
    loading,
    error,
    refresh,
  } = useSuperAdminDashboard();

  const {
    entries: auditEntries,
    loading: auditLoading,
    error: auditError,
    refresh: refreshAudit,
  } = useAuditLogs(8);

  const [reactivatingId, setReactivatingId] = useState<string | null>(null);
  const [reactivateNotice, setReactivateNotice] = useState<string | null>(null);
  // Re-render once after mount so "Last checked" relative time stays honest.
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const handleReactivate = async (user: AdminUserRow) => {
    setReactivatingId(user.id);
    setReactivateNotice(null);
    try {
      await api.post(`/users/${user.id}/reactivate`, {});
      setReactivateNotice(`Reactivated ${user.email}.`);
      refresh();
    } catch (err) {
      const message =
        (err as { error?: { message?: string } })?.error?.message ??
        (err instanceof Error ? err.message : "Reactivation failed.");
      setReactivateNotice(message);
    } finally {
      setReactivatingId(null);
    }
  };

  const unassignedLabel =
    unassignedPosts.length > 0
      ? `${unassignedPosts[0].posts[0]} position currently unassigned`
      : "All leadership posts are assigned";

  // ─── Loading state — layout-preserving skeleton ───
  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto w-full" aria-busy="true">
          <div className="mb-5 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3.4fr)_minmax(260px,0.9fr)]">
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[136px] rounded-lg" />
            <Skeleton className="h-44 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-56 rounded-lg" />
            <Skeleton className="h-56 rounded-lg" />
          </div>
        </div>
      </PageShell>
    );
  }

  // ─── Error state — /users is the core dataset ───
  if (error) {
    return (
      <PageShell>
        <PageHeader />
        <div
          role="alert"
          className="rounded-lg border p-4"
          style={{ borderColor: T.border, backgroundColor: T.mutedSurface }}
        >
          <p className="text-[13px] font-medium" style={{ color: T.destructive }}>
            {error}
          </p>
          <button
            type="button"
            onClick={refresh}
            className="mt-2 text-[12px] font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{ color: T.secondary }}
          >
            Retry
          </button>
        </div>
      </PageShell>
    );
  }

  // ─── Dashboard ───
  return (
    <PageShell>
      <div className="w-full">
        <PageHeader />

        {reactivateNotice && (
          <output
            className="mb-4 block rounded-lg border px-4 py-2 text-[12px]"
            style={{ borderColor: T.border, backgroundColor: T.burgundyPale, color: T.burgundy }}
          >
            {reactivateNotice}
          </output>
        )}

        {/* Reference grid (§9/§10): Rows 1–2 share the banner-width track;
            Rows 3–4 span the full body width. Implemented as one CSS grid
            with two named regions so the Snapshot's right edge aligns with
            the Banner's right edge and the status column stays page background. */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3.4fr)_minmax(260px,0.9fr)] lg:gap-x-[18px] lg:gap-y-4">
          {/* ─── Row 1: Church banner (wide) + System Status (narrow) ─── */}
          <HeroBanner />
          <SystemStatusPanel
            health={health}
            healthError={healthError}
            checkedAt={healthCheckedAt}
          />

          {/* ─── Row 2: System Snapshot — banner-width, NOT full width (§10) ─── */}
          <SystemSnapshot
            totalAccounts={totalAccounts}
            activeAccounts={activeAccounts}
            deactivatedCount={deactivatedAccounts.length}
            memberTotal={memberTotal}
            childrenTotal={childrenTotal}
            subDepartmentCount={subDepartmentCount}
            loading={false}
            membersUnavailable={membersError}
            childrenUnavailable={childrenError}
          />

          {/* ─── Rows 3–4: full-width sub-grid (1.05/1/1 and 1.8/0.9) ─── */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-2 lg:[grid-template-columns:1.05fr_1fr_1fr]">
            <AdministrativeWork
              deactivatedCount={deactivatedAccounts.length}
              conflictCount={rosterConflicts.length}
              unassignedCount={unassignedPosts.length}
              unassignedLabel={unassignedLabel}
            />
            <LeadershipRoster roster={leadershipRoster} loading={false} />
            <RecentAccounts
              accounts={recentAccounts}
              loading={false}
              error={null}
              onRetry={refresh}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-2 lg:[grid-template-columns:1.8fr_0.9fr]">
            <RecentActivity
              entries={auditEntries}
              loading={auditLoading}
              error={auditError}
              onRetry={refreshAudit}
              userNameById={userNameById}
            />
            <FrequentAdministration quickActions={quickActions} />
          </div>
        </div>

        {/* Deactivated accounts table — preserved interactive capability,
            moved below the reference grid to keep the composition intact. */}
        {deactivatedAccounts.length > 0 && (
          <div className="mt-4">
            <Widget
              title="Deactivated Accounts"
              icon={UserX}
              action={<ViewAll href="/users" />}
              id="deactivated-accounts"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: T.mutedSurface }}>
                      <Th>Account</Th>
                      <Th>Role</Th>
                      <Th>Deactivated</Th>
                      <Th>
                        <span className="sr-only">Actions</span>
                      </Th>
                    </tr>
                  </thead>
                  <tbody>
                    {deactivatedAccounts.map((user) => (
                      <tr key={user.id} className="border-t" style={{ borderColor: T.border }}>
                        <Td>
                          <span className="font-medium">{user.name}</span>
                          <span className="block text-[11px]" style={{ color: T.secondary }}>
                            {user.email}
                          </span>
                        </Td>
                        <Td>
                          <RolePill role={user.role} />
                        </Td>
                        <Td className="tabular-nums">
                          {user.deactivatedAt
                            ? new Date(user.deactivatedAt).toLocaleDateString("en-ET", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </Td>
                        <Td>
                          <button
                            type="button"
                            disabled={reactivatingId === user.id}
                            onClick={() => handleReactivate(user)}
                            aria-label={`Reactivate ${user.name}`}
                            className="text-[11px] font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                            style={{ color: T.burgundy }}
                          >
                            {reactivatingId === user.id ? "Reactivating…" : "Reactivate"}
                          </button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Widget>
          </div>
        )}

        {/* Supporting note when the users page cap truncates the dataset. */}
        {loadedAccounts < totalAccounts && (
          <p className="mt-3 px-1 text-[11px]" style={{ color: T.secondary }}>
            Showing the {loadedAccounts} most recent of {totalAccounts} accounts.
          </p>
        )}
      </div>
    </PageShell>
  );
}
