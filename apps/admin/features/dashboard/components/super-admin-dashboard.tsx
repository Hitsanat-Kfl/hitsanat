"use client";

import {
  DashboardContainer,
  DashboardGrid,
  DashboardGridItem,
  DashboardHeader,
  DashboardSection,
  KPIRow,
  type ListItemData,
  ListWidget,
  QuickActionsWidget,
  type StatusSummaryItem,
  StatusSummaryWidget,
} from "@repo/ui";
import { PageShell } from "@/features/shell";
import { useSuperAdminDashboard, type AdminUserRow } from "../hooks/use-super-admin-dashboard";

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

// ============================================================
// Super Admin Dashboard — Phase 11
// ============================================================

export default function SuperAdminDashboardPage() {
  const {
    kpis,
    deactivatedAccounts,
    verificationSummary,
    recentAccounts,
    roleCounts,
    health,
    healthError,
    quickActions,
    loading,
    error,
    refresh,
  } = useSuperAdminDashboard();

  const attentionItems: ListItemData[] = deactivatedAccounts.map(accountItem);
  const recentItems: ListItemData[] = recentAccounts.map(accountItem);
  const rolesItems: ListItemData[] = roleItems(roleCounts);

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
                <ListWidget
                  title="Deactivated Accounts"
                  titleAm="የቦዝኑ መገለጫዎች"
                  description="Accounts currently signed out of the system."
                  items={attentionItems}
                  emptyTitle="No deactivated accounts"
                  emptyDescription="All accounts are currently active."
                  aria-label="Deactivated accounts"
                />
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

          {/* Quick Actions — only real routes from the existing navigation */}
          <DashboardSection title="Quick Actions" titleAm="ፈጣን ድርጊቶች">
            <QuickActionsWidget actions={quickActions} />
          </DashboardSection>
        </div>
      </DashboardContainer>
    </PageShell>
  );
}
