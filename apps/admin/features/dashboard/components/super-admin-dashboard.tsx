"use client";

import {
  ActivityWidget,
  Button,
  DashboardContainer,
  DashboardGrid,
  DashboardGridItem,
  DashboardHeader,
  DashboardSection,
  KPIRow,
  type ListItemData,
  ListWidget,
  QuickActionsWidget,
  Skeleton,
  type StatusSummaryItem,
  StatusSummaryWidget,
} from "@repo/ui";
import { PageShell } from "@/features/shell";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { useAuditLogs } from "../hooks/use-audit-logs";
import {
  useSuperAdminDashboard,
  type AdminUserRow,
  type RosterEntry,
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

function accountItem(user: AdminUserRow): ListItemData {
  return {
    id: user.id,
    primary: user.name,
    secondary: `${user.email} · ${user.role}`,
    trailing: formatDate(user.createdAt),
  };
}

function roleItems(roleCounts: Array<{ role: string; count: number }>): ListItemData[] {
  return roleCounts.map(({ role, count }) => ({
    id: role,
    primary: role,
    secondary: "Assigned accounts",
    trailing: String(count),
  }));
}

/**
 * Leadership Roster Matrix (dashboards.md § 1.3): all leadership posts
 * with BR-009 conflict highlighting.
 */
function rosterItems(entries: RosterEntry[]): ListItemData[] {
  return entries.map((entry) => ({
    id: entry.userId,
    primary: entry.conflict ? `⚠ ${entry.name}` : entry.name,
    secondary: `${entry.email} · ${entry.posts.join(", ")}${
      entry.status === "DEACTIVATED" ? " · deactivated" : ""
    }`,
    trailing: entry.conflict ? "BR-009 conflict" : `${entry.posts.length} post(s)`,
  }));
}

// ============================================================
// Super Admin Dashboard — Phase 11
// ============================================================

export function SuperAdminDashboardPage() {
  const {
    kpis,
    deactivatedAccounts,
    verificationSummary,
    recentAccounts,
    roleCounts,
    leadershipRoster,
    health,
    healthError,
    quickActions,
    loading,
    error,
    refresh,
  } = useSuperAdminDashboard();

  // PE-01 / FR-13.6: one-click reactivation from the "Deactivated Accounts"
  // widget. Errors surface inline; success refreshes the dashboard data.
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

  // LEVEL 4 — real audit trail (no fabricated events; omitted content when unavailable)
  const {
    activity,
    loading: auditLoading,
    error: auditError,
    refresh: refreshAudit,
  } = useAuditLogs();

  const attentionItems: ListItemData[] = deactivatedAccounts.map(accountItem);
  const recentItems: ListItemData[] = recentAccounts.map(accountItem);
  const rolesItems: ListItemData[] = roleItems(roleCounts);
  const roster = rosterItems(leadershipRoster);
  const rosterConflicts = leadershipRoster.filter((entry) => entry.conflict).length;

  if (loading) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Super Admin" }]}>
        <div className="flex items-center justify-center py-12" aria-busy="true">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Super Admin" }]}>
        <div role="alert" className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
          <button type="button" onClick={refresh} className="ml-3 underline underline-offset-2">
            Retry
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Super Admin" }]}>
      <DashboardContainer>
        <DashboardHeader
          title="Super Admin Dashboard"
          description="System-wide administration, access, and operational oversight."
        />

        <div className="space-y-8">
          {/* LEVEL 1 — System Overview */}
          <DashboardSection title="System Overview" titleAm="የስርዓት አጠቃላይ ዕይታ">
            <KPIRow items={kpis} />
          </DashboardSection>

          {/* LEVEL 2 — Administrative Attention */}
          <DashboardSection title="Requires Administrative Attention" titleAm="የሚጠይቅ ትኩረት">
            <DashboardGrid>
              <DashboardGridItem size="md">
                {reactivateNotice && (
                  <output className="mb-2 block rounded-md bg-muted p-2 text-sm">
                    {reactivateNotice}
                  </output>
                )}
                <ListWidget
                  title="Deactivated Accounts"
                  titleAm="የቦዝኑ መገለጫዎች"
                  description="Accounts currently signed out of the system."
                  items={attentionItems}
                  emptyTitle="No deactivated accounts"
                  emptyDescription="All accounts are currently active."
                  aria-label="Deactivated accounts"
                />
                {deactivatedAccounts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {deactivatedAccounts.map((user) => (
                      <Button
                        key={user.id}
                        variant="outline"
                        size="sm"
                        disabled={reactivatingId === user.id}
                        onClick={() => handleReactivate(user)}
                        aria-label={`Reactivate ${user.name}`}
                      >
                        Reactivate {user.name}
                      </Button>
                    ))}
                  </div>
                )}
              </DashboardGridItem>

              <DashboardGridItem size="md">
                <StatusSummaryWidget
                  title="Account Status (የመገለጫ ሁኔታ)"
                  items={verificationSummary as StatusSummaryItem[]}
                  aria-label="Account status summary"
                />
              </DashboardGridItem>
            </DashboardGrid>
          </DashboardSection>

          {/* LEVEL 3 — Users / Roles / Access */}
          <DashboardSection title="Users & Access" titleAm="ተጠቃሚዎች እና መዳረሻ">
            <DashboardGrid>
              <DashboardGridItem size="md">
                <ListWidget
                  title="Recently Provisioned"
                  titleAm="በቅርብ የተፈጠሩ"
                  description="Most recently created accounts."
                  items={recentItems}
                  emptyTitle="No accounts yet"
                  emptyDescription="Provisioned accounts will appear here."
                />
              </DashboardGridItem>

              <DashboardGridItem size="md">
                <ListWidget
                  title="Roles in Use"
                  titleAm="ሚናዎች"
                  description="Accounts grouped by assigned role."
                  items={rolesItems}
                  emptyTitle="No roles assigned"
                  emptyDescription="Role distribution will appear once accounts exist."
                />
              </DashboardGridItem>
            </DashboardGrid>
          </DashboardSection>

          {/* Leadership Roster Matrix — all posts + BR-009 conflicts */}
          <DashboardSection title="Leadership Roster" titleAm="የአመራር ዝርዝር">
            {rosterConflicts > 0 && (
              <output className="mb-2 block rounded-md bg-warning/10 p-3 text-sm text-warning-foreground">
                {rosterConflicts} member(s) hold more than one leadership post (BR-009).
              </output>
            )}
            <DashboardGrid>
              <DashboardGridItem size="lg">
                <ListWidget
                  title="Leadership Posts"
                  titleAm="የአመራር ቦታዎች"
                  description="Executive roles and sub-department leadership, with conflict highlighting."
                  items={roster}
                  emptyTitle="No leadership posts"
                  emptyDescription="Leadership posts will appear once accounts are linked to roles."
                  aria-label="Leadership roster matrix"
                />
              </DashboardGridItem>
            </DashboardGrid>
          </DashboardSection>

          {/* LEVEL 5 — System Health (real /health endpoint only) */}
          <DashboardSection title="System Health" titleAm="የስርዓት ጤንነት">
            {health ? (
              <DashboardGrid>
                <DashboardGridItem size="md">
                  <StatusSummaryWidget
                    title="API Service (የAPI አገልግሎት)"
                    items={[
                      {
                        status: health.status === "ok" ? "active" : "inactive",
                        label: `Status: ${health.status}`,
                        count: 1,
                      },
                      {
                        status: "archived",
                        label: `Environment: ${health.environment}`,
                        count: 1,
                      },
                      { status: "published", label: `Version: ${health.version}`, count: 1 },
                    ]}
                  />
                </DashboardGridItem>
              </DashboardGrid>
            ) : (
              <output className="block rounded-md bg-warning/10 p-4 text-sm text-warning-foreground">
                {healthError
                  ? `API health unavailable — ${healthError}.`
                  : "API health information is not available."}
              </output>
            )}
          </DashboardSection>

          {/* LEVEL 4 — System Activity (real audit trail) */}
          <DashboardSection title="System Activity" titleAm="የስርዓት ተግባር">
            {auditLoading ? (
              <div className="space-y-2" aria-busy="true">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : auditError ? (
              <output className="block rounded-md bg-warning/10 p-4 text-sm text-warning-foreground">
                {auditError}
              </output>
            ) : (
              <ActivityWidget items={activity} maxItems={6} />
            )}
          </DashboardSection>

          {/* Quick Actions — only real routes from the existing navigation */}
          <DashboardSection title="Quick Actions" titleAm="ፈጣን ድርጊቶች">
            <QuickActionsWidget actions={quickActions} />
          </DashboardSection>
        </div>
      </DashboardContainer>
    </PageShell>
  );
}
