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
import Link from "next/link";
import { PageShell } from "@/features/shell";
import { useSubChairpersonDashboard } from "../hooks/use-sub-chairperson-dashboard";
import { departmentDrillDownHref } from "../hooks/use-sub-chairperson-dashboard";

/**
 * Vice-Chairperson (Sub-Chairperson) Dashboard — spec §1.2.
 * Read-only oversight: department status board, report pipeline,
 * deputized review queue (reports + plan drafts).
 */
export function SubChairpersonDashboardPage() {
  const {
    kpis,
    reviewItems,
    reportSummary,
    departmentBoard,
    quickActions,
    loading,
    error,
    refresh,
  } = useSubChairpersonDashboard();

  if (loading) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vice-Chairperson" }]}>
        <div className="flex items-center justify-center py-12" aria-busy="true">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vice-Chairperson" }]}>
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
    <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vice-Chairperson" }]}>
      <DashboardContainer>
        <DashboardHeader
          title="Vice-Chairperson Dashboard"
          description="Delegated oversight of department execution and executive review queues."
        />

        <div className="space-y-8">
          {/* Overview */}
          <DashboardSection title="Oversight Overview" titleAm="አጠቃላይ ዕይታ">
            <KPIRow items={kpis} />
          </DashboardSection>

          {/* Department Status Board (spec §1.2) */}
          <DashboardSection
            title="Department Status Board"
            titleAm="የክፍሎች ሁኔታ"
            description="Weekly execution status per sub-department, with drill-down links."
          >
            <ListWidget
              items={departmentBoard}
              emptyTitle="No sub-departments configured"
              emptyDescription="Departments will appear here once created."
            />
          </DashboardSection>

          {/* Delegated Oversight — report pipeline (read-only) */}
          <DashboardGrid>
            <DashboardGridItem size="md">
              <DashboardSection title="Report Pipeline" titleAm="የሪፖርት ሂደት">
                <StatusSummaryWidget
                  title="All Departments"
                  items={reportSummary as StatusSummaryItem[]}
                  aria-label="Report pipeline summary"
                />
              </DashboardSection>
            </DashboardGridItem>

            {/* Deputized Approvals */}
            <DashboardGridItem size="md">
              <DashboardSection
                title="Awaiting Executive Review"
                titleAm="በመጠባበቅ ላይ"
                action={
                  <Link
                    href="/reports"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View reports
                  </Link>
                }
              >
                <ListWidget
                  items={reviewItems}
                  emptyTitle="Nothing awaiting review"
                  emptyDescription="Submitted reports and plan drafts will appear here."
                />
              </DashboardSection>
            </DashboardGridItem>
          </DashboardGrid>

          {/* Quick Actions — existing routes only */}
          <DashboardSection title="Quick Actions" titleAm="ፈጣን ድርጊቶች">
            <QuickActionsWidget actions={quickActions} />
          </DashboardSection>
        </div>
      </DashboardContainer>
    </PageShell>
  );
}
