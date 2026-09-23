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
import { useMezmurDashboard } from "../hooks/use-mezmur-dashboard";

/**
 * Mezmur Leader Dashboard — Phase 08 spec.
 *
 * Operational ministry workspace:
 * Information hierarchy:
 * 1. Dashboard Header
 * 2. Mezmur Overview (KPIs)
 * 3. Attention / Preparation Required
 * 4. Assignments & Progress (Status Summaries)
 * 5. Mezmur Responsibilities (Distributed Activities)
 * 6. Upcoming Programs & Awdemerit
 * 7. Recent Activity
 * 8. Quick Actions
 */
export function MezmurDashboardPage() {
  const {
    kpis,
    attentionItems,
    distributionSummary,
    sessionSummary,
    responsibilities,
    upcomingPrograms,
    activity,
    activityRestricted,
    quickActions,
    loading,
    error,
    refresh,
  } = useMezmurDashboard();

  if (loading) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Mezmur" }]}>
        <DashboardContainer>
          <DashboardHeader
            title="Mezmur Dashboard"
            description="Manage songs, assignments, programs, and Mezmur responsibilities."
          />
          <div className="space-y-8" aria-busy="true" aria-live="polite">
            <DashboardSection title="Mezmur Overview" titleAm="የመዝሙር አጠቃላይ ዕይታ">
              <KPIRow items={[]} state="loading" />
            </DashboardSection>
            <DashboardGrid>
              <DashboardGridItem size="full">
                <ListWidget title="Preparation Required" items={[]} state="loading" />
              </DashboardGridItem>
            </DashboardGrid>
          </div>
        </DashboardContainer>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Mezmur" }]}>
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
    <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Mezmur" }]}>
      <DashboardContainer>
        {/* 1. Header */}
        <DashboardHeader
          title="Mezmur Dashboard"
          titleAm="የመዝሙር መሪ ዳሽቦርድ"
          description="Manage songs, assignments, programs, and Mezmur responsibilities."
          descriptionAm="መዝሙራትን፣ ምደባዎችን፣ መርሐግብራትን እና የመዝሙር ኃላፊነቶችን ያስተዳድሩ።"
        />

        <div className="space-y-8">
          {/* 2. Mezmur Overview (KPIs) */}
          <DashboardSection title="Mezmur Overview" titleAm="የመዝሙር አጠቃላይ ዕይታ">
            <KPIRow items={kpis} />
          </DashboardSection>

          {/* 3. Attention / Preparation Required */}
          <DashboardSection
            title="Requires Attention"
            titleAm="የሚጠይቅ ትኩረት"
            action={
              <Link
                href="/events"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all events
              </Link>
            }
          >
            <ListWidget
              title="Preparation Required"
              titleAm="ዝግጅት የሚሹ"
              description="Upcoming programs, Awdemerit activities, and unstarted assignments."
              items={attentionItems}
              emptyTitle="No pending preparation"
              emptyDescription="Mezmur responsibilities requiring your attention will appear here."
            />
          </DashboardSection>

          {/* 4. Assignments & Progress (Summaries) */}
          <DashboardSection title="Assignments & Progress" titleAm="ምደባዎች እና እድገት">
            <DashboardGrid>
              <DashboardGridItem size="md">
                <StatusSummaryWidget
                  title="Plan Activities (የዕቅድ ተግባራት)"
                  items={distributionSummary as StatusSummaryItem[]}
                  aria-label="Plan activities summary"
                />
              </DashboardGridItem>

              <DashboardGridItem size="md">
                <StatusSummaryWidget
                  title="Practice & Sessions (የልምምድ ክፍለ-ጊዜዎች)"
                  items={sessionSummary as StatusSummaryItem[]}
                  aria-label="Practice sessions summary"
                />
              </DashboardGridItem>
            </DashboardGrid>
          </DashboardSection>

          {/* 5. Mezmur Responsibilities */}
          <DashboardSection title="Mezmur Responsibilities" titleAm="የመዝሙር ኃላፊነቶች">
            <ListWidget
              title="Distributed Responsibilities"
              titleAm="የተመደቡ ኃላፊነቶች"
              description="Assigned tasks and activities from the active ministry master plan."
              items={responsibilities}
              emptyTitle="No responsibilities distributed yet"
              emptyDescription="Plan activities assigned to Mezmur will appear here once distributed."
            />
          </DashboardSection>

          {/* 6. Upcoming Programs & Awdemerit */}
          <DashboardSection title="Upcoming Programs" titleAm="የሚመጡ መርሐግብራት">
            <UpcomingEventsWidget items={upcomingPrograms} maxItems={4} />
          </DashboardSection>

          {/* 7. Recent Activity */}
          <DashboardSection title="Recent Activity" titleAm="የቅርብ ጊዜ ተግባር">
            {activityRestricted ? (
              <output className="block rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
                The full audit trail is restricted to the Chairperson and Super Admin.
              </output>
            ) : (
              <ActivityWidget items={activity} maxItems={6} />
            )}
          </DashboardSection>

          {/* 8. Quick Actions */}
          <DashboardSection title="Quick Actions" titleAm="ፈጣን ድርጊቶች">
            <QuickActionsWidget actions={quickActions} />
          </DashboardSection>
        </div>
      </DashboardContainer>
    </PageShell>
  );
}
