"use client";

import * as React from "react";
import {
  DashboardContainer,
  DashboardHeader,
  DashboardSection,
  DashboardGrid,
  DashboardGridItem,
  KPIRow,
  ApprovalQueueWidget,
  ProgressWidget,
  StatusSummaryWidget,
  UpcomingEventsWidget,
  ActivityWidget,
  QuickActionsWidget,
} from "@repo/ui";
import { PageShell } from "../components/shell/page-shell";
import {
  getChairpersonKPIs,
  getChairpersonApprovals,
  getChairpersonProgress,
  getChairpersonStatusSummary,
  getChairpersonEvents,
  getChairpersonActivity,
  getChairpersonQuickActions,
} from "../components/dashboard/chairperson-fixtures";

function useCurrentDate(): string {
  const [dateStr, setDateStr] = React.useState("");

  React.useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDateStr(formatted);
  }, []);

  return dateStr;
}

export default function ChairpersonDashboardPage() {
  const currentDate = useCurrentDate();
  const kpis = React.useMemo(() => getChairpersonKPIs(), []);
  const approvals = React.useMemo(() => getChairpersonApprovals(), []);
  const progress = React.useMemo(() => getChairpersonProgress(), []);
  const statusSummary = React.useMemo(() => getChairpersonStatusSummary(), []);
  const events = React.useMemo(() => getChairpersonEvents(), []);
  const activity = React.useMemo(() => getChairpersonActivity(), []);
  const quickActions = React.useMemo(() => getChairpersonQuickActions(), []);

  return (
    <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Chairperson Dashboard" }]}>
      <DashboardContainer>
        <DashboardHeader
          title="Chairperson Dashboard"
          description="Executive overview of ministry operations and organizational health."
          date={currentDate}
        />

        <div className="space-y-8">
          <DashboardSection title="Executive Overview" titleAm="አጠቃላይ ዕይታ">
            <KPIRow items={kpis} />
          </DashboardSection>

          <DashboardSection
            title="Requires Attention"
            titleAm="የሚይዝ ትኩረት"
            action={
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all
              </button>
            }
          >
            <ApprovalQueueWidget items={approvals} maxItems={4} />
          </DashboardSection>

          <DashboardGrid>
            <DashboardGridItem size="lg">
              <DashboardSection title="Organization Health" titleAm="የድርጅት ጤንነት">
                <div className="space-y-4">
                  {progress.map((item) => (
                    <ProgressWidget key={item.label} data={item} />
                  ))}
                </div>
              </DashboardSection>
            </DashboardGridItem>

            <DashboardGridItem size="md">
              <DashboardSection title="Activity Status" titleAm="የተግባር ሁኔታ">
                <StatusSummaryWidget items={statusSummary} />
              </DashboardSection>
            </DashboardGridItem>
          </DashboardGrid>

          <DashboardGrid>
            <DashboardGridItem size="lg">
              <DashboardSection
                title="Upcoming Events"
                titleAm="የሚቀጥሉ ዝግጅቶች"
                action={
                  <a
                    href="/schedule"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View schedule
                  </a>
                }
              >
                <UpcomingEventsWidget items={events} maxItems={4} />
              </DashboardSection>
            </DashboardGridItem>

            <DashboardGridItem size="md">
              <DashboardSection title="Recent Activity" titleAm="የቅርብ ጊዜ ተግባር">
                <ActivityWidget items={activity} maxItems={4} />
              </DashboardSection>
            </DashboardGridItem>
          </DashboardGrid>

          <DashboardSection title="Quick Actions" titleAm="ፈጣን ድርጊቶች">
            <QuickActionsWidget actions={quickActions} />
          </DashboardSection>
        </div>
      </DashboardContainer>
    </PageShell>
  );
}
