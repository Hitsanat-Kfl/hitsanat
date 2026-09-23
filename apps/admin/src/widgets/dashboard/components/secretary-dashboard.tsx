"use client";

import {
  ActivityWidget,
  DashboardContainer,
  DashboardGrid,
  DashboardGridItem,
  DashboardHeader,
  DashboardSection,
  KPIRow,
  ListWidget,
  QuickActionsWidget,
  type StatusSummaryItem,
  StatusSummaryWidget,
  UpcomingEventsWidget,
} from "@repo/ui";
import Link from "next/link";
import { PageShell } from "@/widgets/shell";
import { useSecretaryDashboard } from "../hooks/use-secretary-dashboard";

/**
 * Secretary Dashboard — Phase 06 spec.
 *
 * Operational administrative workspace:
 * Information hierarchy:
 * 1. Dashboard Header
 * 2. Registration Overview (KPIs)
 * 3. Pending Records / Administrative Attention
 * 4. Children, Members & Families Overview
 * 5. Recent Activity
 * 6. Upcoming Activities
 * 7. Quick Actions
 */
export function SecretaryDashboardPage() {
  const {
    kpis,
    pendingRecords,
    memberRecordsSummary,
    childrenRecordsSummary,
    upcomingEvents,
    activity,
    activityRestricted,
    quickActions,
    loading,
    error,
    refresh,
  } = useSecretaryDashboard();

  if (loading) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Secretary" }]}>
        <DashboardContainer>
          <DashboardHeader
            title="Secretary Dashboard"
            description="Manage registrations, records, families, and administrative activities."
          />
          <div className="space-y-8" aria-busy="true" aria-live="polite">
            <DashboardSection title="Registration Overview" titleAm="አጠቃላይ የምዝገባ ዕይታ">
              <KPIRow items={[]} state="loading" />
            </DashboardSection>
            <DashboardGrid>
              <DashboardGridItem size="full">
                <ListWidget title="Pending & Incomplete Records" items={[]} state="loading" />
              </DashboardGridItem>
            </DashboardGrid>
          </div>
        </DashboardContainer>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Secretary" }]}>
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
    <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Secretary" }]}>
      <DashboardContainer>
        {/* 1. Header */}
        <DashboardHeader
          title="Secretary Dashboard"
          titleAm="የጸሐፊ ዳሽቦርድ"
          description="Manage registrations, records, families, and administrative activities."
          descriptionAm="ምዝገባዎችን፣ መዝገቦችን፣ ቤተሰቦችን እና አስተዳደራዊ ተግባራትን ያስተዳድሩ።"
        />

        <div className="space-y-8">
          {/* 2. Registration Overview (KPIs) */}
          <DashboardSection title="Registration Overview" titleAm="አጠቃላይ የምዝገባ ዕይታ">
            <KPIRow items={kpis} />
          </DashboardSection>

          {/* 3. Pending Records / Administrative Attention */}
          <DashboardSection
            title="Requires Attention"
            titleAm="የሚጠይቅ ትኩረት"
            action={
              <Link
                href="/members"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all members
              </Link>
            }
          >
            <ListWidget
              title="Pending & Incomplete Records"
              titleAm="የሚጠባበቁ እና ያልተሟሉ መዝገቦች"
              description="Records requiring stage completion, family linkage, or status review."
              items={pendingRecords}
              emptyTitle="No pending records"
              emptyDescription="Administrative records requiring your attention will appear here."
            />
          </DashboardSection>

          {/* 4. Children, Members & Families Overview */}
          <DashboardSection title="Records Overview" titleAm="የመዝገቦች አጠቃላይ ዕይታ">
            <DashboardGrid>
              <DashboardGridItem size="md">
                <StatusSummaryWidget
                  title="Member Records (የአባላት መዝገብ)"
                  items={memberRecordsSummary as StatusSummaryItem[]}
                  aria-label="Member records summary"
                />
              </DashboardGridItem>

              <DashboardGridItem size="md">
                <StatusSummaryWidget
                  title="Children Records (የሕፃናት መዝገብ)"
                  items={childrenRecordsSummary as StatusSummaryItem[]}
                  aria-label="Children records summary"
                />
              </DashboardGridItem>
            </DashboardGrid>
          </DashboardSection>

          {/* 5. Recent Registration / Record Activity */}
          <DashboardSection title="Recent Activity" titleAm="የቅርብ ጊዜ ተግባር">
            {activityRestricted ? (
              <output className="block rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
                The full audit trail is restricted to the Chairperson and Super Admin.
              </output>
            ) : (
              <ActivityWidget items={activity} maxItems={6} />
            )}
          </DashboardSection>

          {/* 6. Upcoming Administrative Activities */}
          <DashboardSection title="Upcoming Activities" titleAm="የሚመጡ ዝግጅቶች">
            <UpcomingEventsWidget items={upcomingEvents} maxItems={4} />
          </DashboardSection>

          {/* 7. Quick Actions */}
          <DashboardSection title="Quick Actions" titleAm="ፈጣን ድርጊቶች">
            <QuickActionsWidget actions={quickActions} />
          </DashboardSection>
        </div>
      </DashboardContainer>
    </PageShell>
  );
}
