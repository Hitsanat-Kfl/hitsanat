"use client";

import {
  ActivityWidget,
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
  UpcomingEventsWidget,
} from "@repo/ui";
import Link from "next/link";
import { PageShell } from "@/widgets/shell";
import { useSubChairpersonDashboard } from "../hooks/use-sub-chairperson-dashboard";

/**
 * Sub-Chairperson Dashboard — Phase 06 spec.
 *
 * Information hierarchy (spec §4): Coordination Overview → Attention →
 * Activity/Plan Progress → Responsibilities → Upcoming → Recent Activity
 * → Quick Actions. Coordination and follow-up lead; this is deliberately
 * not the Chairperson's executive overview.
 *
 * Progress is shown as real backend counts (distribution statuses,
 * report pipeline). No percentages are invented — the API's weighted
 * roll-up (BR-030) has no percentage field, so a fake progress bar
 * would fabricate data.
 */
export function SubChairpersonDashboardPage() {
  const {
    kpis,
    reviewItems,
    reportSummary,
    distributionSummary,
    assignmentItems,
    upcomingEvents,
    activity,
    activityRestricted,
    hasActivePlan,
    departmentBoard,
    quickActions,
    loading,
    error,
    refresh,
  } = useSubChairpersonDashboard();

  if (loading) {
    // Phase 06 §24: skeleton placeholders matching the loaded layout
    // (KPI row + two-column widget rows) instead of a bare spinner.
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sub-Chairperson" }]}>
        <DashboardContainer>
          <DashboardHeader
            title="Sub-Chairperson Dashboard"
            description="Coordinate ministry activities, follow up on responsibilities, and monitor progress."
          />
          <div className="space-y-8" aria-busy="true" aria-live="polite">
            <DashboardSection title="Coordination Overview" titleAm="የመሪ ሁኔታ">
              <KPIRow items={[]} state="loading" />
            </DashboardSection>
            <DashboardGrid>
              <DashboardGridItem size="md">
                <ListWidget title="Awaiting Executive Review" items={[]} state="loading" />
              </DashboardGridItem>
              <DashboardGridItem size="md">
                <StatusSummaryWidget title="Report Pipeline" items={[]} state="loading" />
              </DashboardGridItem>
            </DashboardGrid>
          </div>
        </DashboardContainer>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sub-Chairperson" }]}>
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
    <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sub-Chairperson" }]}>
      <DashboardContainer>
        <DashboardHeader
          title="Sub-Chairperson Dashboard"
          titleAm="የምክትል ሰብሳቢ ዳሽቦርድ"
          description="Coordinate ministry activities, follow up on responsibilities, and monitor progress."
          descriptionAm="የሚኒስትሪ ተግባራትን ያስተባብሩ፣ ኃላፊነቶችን ይከታተሉ እና እድገትን ይቆጣጠሩ።"
        />

        <div className="space-y-8">
          {/* LEVEL 1 — Coordination Overview */}
          <DashboardSection title="Coordination Overview" titleAm="የመሪ ሁኔታ">
            <KPIRow items={kpis} />
          </DashboardSection>

          {/* LEVEL 2 — Attention */}
          <DashboardSection
            title="Requires Attention"
            titleAm="የሚጠይቅ ትኩረት"
            action={
              <Link
                href="/reports"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View reports
              </Link>
            }
          >
            <DashboardGrid>
              <DashboardGridItem size="md">
                <ListWidget
                  title="Awaiting Executive Review"
                  titleAm="በመጠባበቅ ላይ"
                  description="Submitted reports and plan drafts."
                  items={reviewItems}
                  emptyTitle="Nothing awaiting review"
                  emptyDescription="Submitted reports and plan drafts will appear here."
                />
              </DashboardGridItem>

              <DashboardGridItem size="md">
                <StatusSummaryWidget
                  title="Report Pipeline (የሪፖርት ሂደት)"
                  items={reportSummary as StatusSummaryItem[]}
                  aria-label="Report pipeline summary"
                />
              </DashboardGridItem>
            </DashboardGrid>
          </DashboardSection>

          {/* LEVEL 3 — Activity and plan progress (real counts) */}
          <DashboardSection title="Activity & Plan Progress" titleAm="የዕቅድ እድገት">
            <DashboardGrid>
              <DashboardGridItem size="md">
                {hasActivePlan ? (
                  <StatusSummaryWidget
                    title="Distributed Activities"
                    titleAm="የተሰራጩ ተግባራት"
                    items={distributionSummary as StatusSummaryItem[]}
                    aria-label="Distribution progress summary"
                  />
                ) : (
                  <ListWidget
                    title="Distributed Activities"
                    titleAm="የተሰራጩ ተግባራት"
                    items={[]}
                    emptyTitle="No active plan"
                    emptyDescription="Distribution progress appears once a plan is activated."
                  />
                )}
              </DashboardGridItem>

              <DashboardGridItem size="md">
                <ListWidget
                  title="Department Status Board"
                  titleAm="የክፍሎች ሁኔታ"
                  description="Report pipeline per sub-department."
                  items={departmentBoard}
                  emptyTitle="No sub-departments configured"
                  emptyDescription="Departments will appear here once created."
                />
              </DashboardGridItem>
            </DashboardGrid>
          </DashboardSection>

          {/* LEVEL 4 — Responsibilities / assignments */}
          <DashboardSection title="Responsibilities" titleAm="ኃላፊነቶች">
            <ListWidget
              title="Distributed Plan Activities"
              titleAm="የተሰራጩ የዕቅድ ተግባራት"
              description="Activities assigned to sub-departments from the active plan."
              items={assignmentItems}
              emptyTitle={hasActivePlan ? "No activities distributed yet" : "No active plan"}
              emptyDescription={
                hasActivePlan
                  ? "Activities appear here once the plan is distributed."
                  : "Assignments appear once a plan is activated and distributed."
              }
            />
          </DashboardSection>

          {/* LEVEL 5 — Upcoming activities */}
          <DashboardSection title="Upcoming Activities" titleAm="የሚመጡ ዝግጅቶች">
            <UpcomingEventsWidget items={upcomingEvents} maxItems={4} />
          </DashboardSection>

          {/* LEVEL 6 — Recent activity (real audit trail; restricted for this role) */}
          <DashboardSection title="Recent Activity" titleAm="የቅርብ ጊዜ ተግባር">
            {activityRestricted ? (
              <output className="block rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
                The full audit trail is restricted to the Chairperson and Super Admin.
              </output>
            ) : (
              <ActivityWidget items={activity} maxItems={6} />
            )}
          </DashboardSection>

          {/* Quick Actions — existing routes only */}
          <DashboardSection title="Quick Actions" titleAm="ፈጣን ድርጊቶች">
            <QuickActionsWidget actions={quickActions} />
          </DashboardSection>
        </div>
      </DashboardContainer>
    </PageShell>
  );
}
