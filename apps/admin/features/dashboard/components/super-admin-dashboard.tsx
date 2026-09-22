"use client";

import { PageShell } from "@/features/shell";
import { api } from "@/lib/api-client";
import { Skeleton } from "@repo/ui";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  ChevronRight,
  FileText,
  HeartPulse,
  KeyRound,
  Layers,
  UserCheck,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { useAuditLogs } from "../hooks/use-audit-logs";
import {
  type AdminUserRow,
  type QuickActionIconKey,
  type RosterEntry,
  type SuperAdminQuickAction,
  useSuperAdminDashboard,
} from "../hooks/use-super-admin-dashboard";

// ============================================================
// Presentational helpers — formatting only, no business rules.
// ============================================================

function formatDate(value: string | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" });
}

// ============================================================
// Design tokens — Phase 01 semantic tokens where available;
// the rest are local to this dashboard page.
// ============================================================

const T = {
  burgundy: "#32131F",
  burgundyLight: "#F8EEF2",
  gold: "#E5AE60",
  goldLight: "#F9EEDB",
  foreground: "#182235",
  muted: "#718096",
  border: "#E7EBEF",
  borderLight: "#F3F5F7",
  track: "#E9EDF1",
  success: "#159A70",
  successLight: "#E8F7F1",
  warning: "#D99127",
  warningLight: "#FFF3DF",
  destructive: "#C94B55",
  destructiveLight: "#F8E8EA",
  conflictBg: "#FFF8EC",
} as const;

const QUICK_ACTION_ICONS: Record<QuickActionIconKey, LucideIcon> = {
  users: UserCog,
  "audit-logs": FileText,
  permissions: KeyRound,
  members: Users,
  "sub-departments": Building2,
  reports: BarChart3,
};

const ROLE_BADGE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  CHAIRPERSON: "Chairperson",
  SUB_CHAIRPERSON: "Vice Chairperson",
  SECRETARY: "Secretary",
};

function roleBadgeLabel(role: string): string {
  return ROLE_BADGE_LABELS[role] ?? role;
}

// ============================================================
// Widget primitives — white surface, hairline border, 6px radius,
// minimal shadow. Consistent 12px internal padding.
// ============================================================

function Widget({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-md border bg-card ${className}`}
      style={{ borderColor: T.border }}
      aria-label={title}
    >
      <header
        className="flex min-h-[44px] items-center justify-between gap-2 border-b px-4 py-2.5"
        style={{ borderColor: T.border }}
      >
        <h2 className="text-[13px] font-semibold" style={{ color: T.foreground }}>
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
      className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {label}
    </Link>
  );
}

// ============================================================
// KPI Card — compact, value-dominant, no decorative excess.
// ============================================================

function KpiCard({
  label,
  value,
  supporting,
  icon: Icon,
  iconStyle,
  href,
}: {
  label: string;
  value: string;
  supporting: string;
  icon: LucideIcon;
  iconStyle: CSSProperties;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-3 rounded-md border bg-card p-4 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ borderColor: T.border }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: T.muted }}>
          {label}
        </p>
        <p
          className="mt-1.5 text-[28px] font-bold tabular-nums leading-none tracking-tight"
          style={{ color: T.foreground }}
        >
          {value}
        </p>
        <p className="mt-1.5 text-[11px]" style={{ color: T.muted }}>
          {supporting}
        </p>
      </div>
      <div className="flex items-start gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={iconStyle}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ color: T.muted }}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

// ============================================================
// Table primitives — compact, scannable, consistent density.
// ============================================================

function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider ${className}`}
      style={{ color: T.muted }}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td
      className={`whitespace-nowrap px-3 py-2 text-[13px] ${className}`}
      style={{ color: T.foreground }}
    >
      {children}
    </td>
  );
}

function Pill({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium leading-4"
      style={style}
    >
      {children}
    </span>
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

function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 px-4 py-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
        <Skeleton key={`row-${i}`} className="h-9 w-full" />
      ))}
    </div>
  );
}

function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-6 text-center">
      <p className="text-[13px]" style={{ color: T.muted }}>
        {children}
      </p>
    </div>
  );
}

function WidgetErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 px-4 py-5 text-center">
      <p className="text-[13px]" style={{ color: T.destructive }}>
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-[11px] font-medium text-muted-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ============================================================
// Account Status — accessible donut (SVG, two lifecycle segments).
// Reduced size for tighter 4-col layout.
// ============================================================

function AccountStatusDonut({
  active,
  deactivated,
}: {
  active: number;
  deactivated: number;
}) {
  const total = active + deactivated;
  const size = 120;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const activeFraction = total > 0 ? active / total : 0;
  const activeLength = circumference * activeFraction;

  return (
    <figure className="flex flex-col items-center gap-4 px-4 py-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`Account status: ${active} active, ${deactivated} deactivated, ${total} total accounts`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={T.track}
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={T.success}
            strokeWidth={stroke}
            strokeDasharray={`${activeLength} ${circumference - activeLength}`}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={T.gold}
            strokeWidth={stroke}
            strokeDasharray={`${circumference - activeLength} ${activeLength}`}
            strokeDashoffset={-activeLength}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold tabular-nums leading-none"
            style={{ color: T.foreground }}
          >
            {total}
          </span>
          <span className="mt-1 text-[10px]" style={{ color: T.muted }}>
            Total
          </span>
        </div>
      </div>
      <figcaption className="w-full space-y-1.5">
        {[
          { label: "Active", value: active, color: T.success },
          { label: "Deactivated", value: deactivated, color: T.gold },
        ].map((legend) => (
          <div key={legend.label} className="flex items-center justify-between text-[12px]">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: legend.color }}
                aria-hidden="true"
              />
              <span style={{ color: T.foreground }}>{legend.label}</span>
            </span>
            <span className="font-semibold tabular-nums" style={{ color: T.foreground }}>
              {legend.value}
            </span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}

// ============================================================
// Roles in Use — burgundy horizontal bars, tighter spacing.
// ============================================================

function RoleBar({
  role,
  count,
  percentage,
}: {
  role: string;
  count: number;
  percentage: number;
}) {
  return (
    <li>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-medium" style={{ color: T.foreground }}>
          {roleBadgeLabel(role)}
        </span>
        <span className="shrink-0 text-[11px] tabular-nums" style={{ color: T.muted }}>
          {count} ({percentage}%)
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: T.track }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(percentage, 2)}%`, backgroundColor: T.burgundy }}
        />
      </div>
    </li>
  );
}

// ============================================================
// Quick action tile — compact, scannable.
// ============================================================

function QuickActionTile({ action }: { action: SuperAdminQuickAction }) {
  const Icon = QUICK_ACTION_ICONS[action.icon];
  return (
    <Link
      href={action.href}
      className="group flex items-center gap-2.5 rounded-md border bg-card px-3 py-2.5 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ borderColor: T.border }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: T.burgundyLight, color: T.burgundy }}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-semibold" style={{ color: T.foreground }}>
          {action.title}
        </span>
        <span className="block truncate text-[11px]" style={{ color: T.muted }}>
          {action.description}
        </span>
      </span>
      <ChevronRight
        className="h-3.5 w-3.5 shrink-0 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
        style={{ color: T.muted }}
        aria-hidden="true"
      />
    </Link>
  );
}

// ============================================================
// System Health tile — compact, status-focused.
// ============================================================

function SystemHealthTile({
  health,
  healthError,
}: {
  health: { status: string; version: string; environment: string } | null;
  healthError: string | null;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-md border bg-card p-3"
      style={{ borderColor: T.border }}
      data-testid="api-status-tile"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{
          backgroundColor: health ? T.successLight : T.destructiveLight,
          color: health ? T.success : T.destructive,
        }}
        aria-hidden="true"
      >
        <HeartPulse className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold" style={{ color: T.foreground }}>
          API Status
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: T.muted }}>
          {health
            ? `Operational · v${health.version} · ${health.environment}`
            : (healthError ?? "Unreachable")}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Super Admin Dashboard — visual refinement pass.
// ============================================================

export function SuperAdminDashboardPage() {
  const {
    totalAccounts,
    activeAccounts,
    loadedAccounts,
    deactivatedAccounts,
    recentAccounts,
    roleCounts,
    leadershipRoster,
    subDepartmentCount,
    userNameById,
    health,
    healthError,
    quickActions,
    loading,
    error,
    refresh,
  } = useSuperAdminDashboard();

  const {
    activity,
    loading: auditLoading,
    error: auditError,
    refresh: refreshAudit,
  } = useAuditLogs(8);

  const [reactivatingId, setReactivatingId] = useState<string | null>(null);
  const [reactivateNotice, setReactivateNotice] = useState<string | null>(null);

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

  const rosterConflicts = leadershipRoster.filter((entry) => entry.conflict).length;

  // ─── Loading state ───
  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-[1400px]" aria-busy="true">
          <div className="mb-5 space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={`kpi-${i}`} className="h-24 rounded-md" />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-12">
            <Skeleton className="h-56 rounded-md lg:col-span-8" />
            <Skeleton className="h-56 rounded-md lg:col-span-4" />
            <Skeleton className="h-48 rounded-md lg:col-span-8" />
            <Skeleton className="h-48 rounded-md lg:col-span-4" />
            <Skeleton className="h-44 rounded-md lg:col-span-12" />
          </div>
        </div>
      </PageShell>
    );
  }

  // ─── Error state ───
  if (error) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-[1400px]">
          <div
            role="alert"
            className="rounded-md border p-4"
            style={{ borderColor: T.border, backgroundColor: T.destructiveLight }}
          >
            <p className="text-[13px] font-medium" style={{ color: T.destructive }}>
              {error}
            </p>
            <button
              type="button"
              onClick={refresh}
              className="mt-2 text-[12px] font-medium text-muted-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  // ─── Dashboard ───
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-[1400px]">
        {/* ─── Page Header ─── */}
        <header className="mb-5">
          <h1
            className="text-[22px] font-semibold leading-tight tracking-tight sm:text-[24px]"
            style={{ color: T.burgundy }}
          >
            Super Admin Dashboard
          </h1>
          <p className="mt-0.5 text-[12px]" style={{ color: T.muted }}>
            System administration, user management, and platform oversight.
          </p>
        </header>

        {reactivateNotice && (
          <output
            className="mb-3 block rounded-md border px-3 py-2 text-[12px]"
            style={{ borderColor: T.border, backgroundColor: T.goldLight, color: T.burgundy }}
          >
            {reactivateNotice}
          </output>
        )}

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* ─── Row 1: KPI Row — 4 equal cards (3 cols each) ─── */}
          <div className="grid grid-cols-2 gap-3 lg:col-span-12 lg:grid-cols-4">
            <KpiCard
              label="User Accounts"
              value={String(totalAccounts)}
              supporting="All provisioned accounts"
              icon={UserCog}
              iconStyle={{ backgroundColor: T.burgundyLight, color: T.burgundy }}
              href="/users"
            />
            <KpiCard
              label="Active Accounts"
              value={String(activeAccounts)}
              supporting={
                loadedAccounts < totalAccounts
                  ? `Active (of ${loadedAccounts} loaded)`
                  : "Status ACTIVE"
              }
              icon={UserCheck}
              iconStyle={{ backgroundColor: T.successLight, color: T.success }}
              href="/users"
            />
            <KpiCard
              label="Sub-Departments"
              value={String(subDepartmentCount)}
              supporting="Configured programs"
              icon={Layers}
              iconStyle={{ backgroundColor: T.goldLight, color: T.warning }}
              href="/sub-departments"
            />
            <KpiCard
              label="API Health"
              value={health ? "Healthy" : "Down"}
              supporting={
                health
                  ? `v${health.version} · ${health.environment}`
                  : "Health endpoint not responding"
              }
              icon={HeartPulse}
              iconStyle={{
                backgroundColor: health ? T.successLight : T.destructiveLight,
                color: health ? T.success : T.destructive,
              }}
              href="/reports"
            />
          </div>

          {/* ─── Row 2: Deactivated Accounts (8) + Account Status (4) ─── */}
          <Widget
            title="Deactivated Accounts"
            className="lg:col-span-8"
            action={<ViewAll href="/users" />}
          >
            {deactivatedAccounts.length === 0 ? (
              <EmptyHint>No deactivated accounts — all accounts are active.</EmptyHint>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: T.borderLight }}>
                      <Th>Account</Th>
                      <Th>Role</Th>
                      <Th>Deactivated</Th>
                      <Th>Status</Th>
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
                          <span className="block text-[11px]" style={{ color: T.muted }}>
                            {user.email}
                          </span>
                        </Td>
                        <Td>{roleBadgeLabel(user.role)}</Td>
                        <Td className="tabular-nums">{formatDate(user.deactivatedAt)}</Td>
                        <Td>
                          <Pill style={{ backgroundColor: T.goldLight, color: T.warning }}>
                            Deactivated
                          </Pill>
                        </Td>
                        <Td>
                          <button
                            type="button"
                            disabled={reactivatingId === user.id}
                            onClick={() => handleReactivate(user)}
                            aria-label={`Reactivate ${user.name}`}
                            className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
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
            )}
          </Widget>

          <Widget
            title="Account Status"
            className="lg:col-span-4"
            aria-label="Account status summary"
          >
            <AccountStatusDonut active={activeAccounts} deactivated={deactivatedAccounts.length} />
          </Widget>

          {/* ─── Row 3: Recently Provisioned (8) + Roles in Use (4) ─── */}
          <Widget
            title="Recently Provisioned"
            className="lg:col-span-8"
            action={<ViewAll href="/users" />}
          >
            {recentAccounts.length === 0 ? (
              <EmptyHint>No accounts provisioned yet.</EmptyHint>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: T.borderLight }}>
                      <Th>Name</Th>
                      <Th>Role</Th>
                      <Th>Created</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAccounts.map((user) => (
                      <tr key={user.id} className="border-t" style={{ borderColor: T.border }}>
                        <Td>
                          <span className="font-medium">{user.name}</span>
                          <span className="block text-[11px]" style={{ color: T.muted }}>
                            {user.email}
                          </span>
                        </Td>
                        <Td>
                          <Pill style={{ backgroundColor: T.burgundyLight, color: T.burgundy }}>
                            {roleBadgeLabel(user.role)}
                          </Pill>
                        </Td>
                        <Td className="tabular-nums">{formatDate(user.createdAt)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Widget>

          <Widget
            title="Roles in Use"
            className="lg:col-span-4"
            action={<ViewAll href="/permissions" />}
          >
            {roleCounts.length === 0 ? (
              <EmptyHint>No roles assigned yet.</EmptyHint>
            ) : (
              <ul className="space-y-3 px-4 py-3">
                {roleCounts.map(({ role, count }) => {
                  const totalRoleAccounts = roleCounts.reduce((sum, r) => sum + r.count, 0);
                  const percentage =
                    totalRoleAccounts > 0 ? Math.round((count / totalRoleAccounts) * 100) : 0;
                  return <RoleBar key={role} role={role} count={count} percentage={percentage} />;
                })}
              </ul>
            )}
          </Widget>

          {/* ─── Row 4: Leadership Roster (12 — full width) ─── */}
          <Widget
            title="Leadership Roster"
            className="lg:col-span-12"
            action={<ViewAll href="/users" />}
          >
            {leadershipRoster.length === 0 ? (
              <EmptyHint>No leadership posts assigned yet.</EmptyHint>
            ) : (
              <div className="overflow-x-auto">
                {rosterConflicts > 0 && (
                  <div
                    className="mx-4 mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-[12px]"
                    style={{
                      borderColor: T.gold,
                      backgroundColor: T.conflictBg,
                      color: T.burgundy,
                    }}
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: T.warning }} />
                    <span>
                      <strong>{rosterConflicts}</strong> member{rosterConflicts === 1 ? "" : "s"}{" "}
                      {rosterConflicts === 1 ? "holds" : "hold"} more than one leadership post
                      (BR-009).
                    </span>
                  </div>
                )}
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: T.borderLight }}>
                      <Th>Post</Th>
                      <Th>Name</Th>
                      <Th>Department</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadershipRoster.map((entry: RosterEntry) => (
                      <tr
                        key={entry.userId}
                        className="border-t"
                        style={
                          entry.conflict
                            ? { borderColor: T.border, backgroundColor: T.conflictBg }
                            : { borderColor: T.border }
                        }
                      >
                        <Td>
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
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
                          <span className="font-medium">{entry.name}</span>
                          <span className="block text-[11px]" style={{ color: T.muted }}>
                            {entry.email}
                          </span>
                        </Td>
                        <Td>{entry.department ?? "Executive"}</Td>
                        <Td>
                          {entry.status === "ACTIVE" ? (
                            <StatusDot color={T.success}>Active</StatusDot>
                          ) : (
                            <StatusDot color={T.destructive}>Deactivated</StatusDot>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Widget>

          {/* ─── Row 5: System Activity (12 — full width) ─── */}
          <Widget
            title="System Activity"
            className="lg:col-span-12"
            action={<ViewAll href="/audit-logs" />}
          >
            {auditLoading ? (
              <TableSkeleton rows={4} />
            ) : auditError ? (
              <WidgetErrorState message={auditError} onRetry={refreshAudit} />
            ) : activity.length === 0 ? (
              <EmptyHint>No system activity recorded yet.</EmptyHint>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: T.borderLight }}>
                      <Th>Time</Th>
                      <Th>Actor</Th>
                      <Th>Action</Th>
                      <Th>Target</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.slice(0, 8).map((item) => {
                      const isDestructive = item.status === "destructive";
                      return (
                        <tr key={item.id} className="border-t" style={{ borderColor: T.border }}>
                          <Td className="tabular-nums">{item.timestamp}</Td>
                          <Td>{userNameById[item.actor] ?? item.actor}</Td>
                          <Td>{item.action}</Td>
                          <Td>{item.entity}</Td>
                          <Td>
                            {isDestructive ? (
                              <StatusDot color={T.warning}>Warning</StatusDot>
                            ) : (
                              <StatusDot color={T.success}>Success</StatusDot>
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

          {/* ─── Row 6: System Health (5) + Quick Actions (7) ─── */}
          <Widget title="System Health" className="lg:col-span-5">
            <div className="p-3">
              <SystemHealthTile health={health} healthError={healthError} />
            </div>
          </Widget>

          <Widget title="Quick Actions" className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-2 p-3">
              {quickActions.map((action) => (
                <QuickActionTile key={action.id} action={action} />
              ))}
            </div>
          </Widget>
        </div>
      </div>
    </PageShell>
  );
}
