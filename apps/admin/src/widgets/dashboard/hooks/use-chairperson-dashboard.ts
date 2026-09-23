"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  ActivityItem,
  ApprovalQueueItem,
  EventItem,
  KPIData,
  ProgressData,
  QuickAction,
  StatusSummaryItem,
} from "@repo/ui";
import { type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type {
  PublicEvent,
  PublicAnnouncement,
  PeriodicReport,
  AnnualMasterPlan,
} from "@/domains/definitions";

interface UseChairpersonDashboardResult {
  kpis: KPIData[];
  approvals: ApprovalQueueItem[];
  progress: ProgressData[];
  statusSummary: StatusSummaryItem[];
  events: EventItem[];
  activity: ActivityItem[];
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

interface ChairpersonDashboardData {
  kpis: KPIData[];
  approvals: ApprovalQueueItem[];
  progress: ProgressData[];
  statusSummary: StatusSummaryItem[];
  events: EventItem[];
  activity: ActivityItem[];
  quickActions: QuickAction[];
}

async function fetchChairpersonDashboard(): Promise<ChairpersonDashboardData> {
  // Fetch all data in parallel
  const [membersRes, childrenRes, eventsRes, announcementsRes, reportsRes, plansRes] =
    await Promise.allSettled([
      api.get<PaginatedResponse<unknown>>("/members?limit=1"),
      api.get<PaginatedResponse<unknown>>("/children?limit=1"),
      api.get<PaginatedResponse<PublicEvent>>("/events?upcoming=true&limit=5"),
      api.get<PaginatedResponse<PublicAnnouncement>>("/announcements?limit=5"),
      api.get<PaginatedResponse<PeriodicReport>>("/reports?limit=5"),
      api.get<PaginatedResponse<AnnualMasterPlan>>("/annual-plans?limit=1"),
    ]);

  // Extract totals
  const memberTotal =
    membersRes.status === "fulfilled" ? (membersRes.value.pagination?.total ?? 0) : 0;
  const childTotal =
    childrenRes.status === "fulfilled" ? (childrenRes.value.pagination?.total ?? 0) : 0;
  const eventsList = eventsRes.status === "fulfilled" ? (eventsRes.value.data ?? []) : [];
  const announcementsList =
    announcementsRes.status === "fulfilled" ? (announcementsRes.value.data ?? []) : [];
  const reportsList = reportsRes.status === "fulfilled" ? (reportsRes.value.data ?? []) : [];
  const plansList = plansRes.status === "fulfilled" ? (plansRes.value.data ?? []) : [];

  // Build KPIs
  const kpis: KPIData[] = [
    {
      label: "Active Members",
      value: String(memberTotal),
      description: "Registered ministry members",
    },
    {
      label: "Enrolled Children",
      value: String(childTotal),
      description: "Currently enrolled children",
    },
    {
      label: "Upcoming Events",
      value: String(eventsList.length),
      description: "Scheduled events",
    },
    {
      label: "Recent Reports",
      value: String(reportsList.length),
      description: "Generated reports",
    },
  ];

  // Build Approvals (from announcements as placeholder)
  const approvals: ApprovalQueueItem[] = announcementsList.slice(0, 4).map((ann) => ({
    id: ann.id,
    title: ann.title,
    requester: ann.targetAudience,
    date: ann.publishedAt
      ? new Date(ann.publishedAt).toLocaleDateString("en-ET", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Draft",
    status: ann.publishedAt ? "active" : "pending",
    onView: () => {},
  }));

  // Build Progress (from plans)
  const newProgress: ProgressData[] = plansList.slice(0, 2).map((plan) => ({
    label: plan.title,
    percentage: plan.status === "Active" ? 50 : plan.status === "Completed" ? 100 : 0,
    completed: 0,
    target: 0,
    status: plan.status === "Completed" ? "success" : "default",
  }));
  const progress: ProgressData[] =
    newProgress.length > 0
      ? newProgress
      : [
          {
            label: "Annual Plan Completion",
            percentage: 0,
            completed: 0,
            target: 0,
            status: "default",
          },
        ];

  // Build Status Summary
  const completedReports = reportsList.filter((r) => r.status === "Approved").length;
  const pendingReports = reportsList.filter(
    (r) => r.status === "Draft" || r.status === "Submitted"
  ).length;
  const statusSummary: StatusSummaryItem[] = [
    { status: "completed", label: "Approved Reports", count: completedReports },
    { status: "in-progress", label: "Pending Review", count: pendingReports },
    {
      status: "pending",
      label: "Draft Reports",
      count: reportsList.length - completedReports - pendingReports,
    },
  ];

  // Build Events
  const events: EventItem[] = eventsList.slice(0, 4).map((evt) => ({
    id: evt.id,
    title: evt.title,
    date: evt.eventDate,
    time: new Date(evt.eventDate).toLocaleTimeString("en-ET", {
      hour: "numeric",
      minute: "2-digit",
    }),
    location: evt.venue ?? "TBD",
    responsibleRole: "Events Committee",
  }));

  // Build Activity (from announcements as recent activity)
  const activity: ActivityItem[] = announcementsList.slice(0, 5).map((ann, idx) => ({
    id: ann.id,
    actor: "Ministry",
    action: "published announcement",
    entity: ann.title,
    timestamp: ann.publishedAt ? `${idx + 1} days ago` : "Recently",
  }));

  // Build Quick Actions
  const quickActions: QuickAction[] = [
    { id: "qa-plan", label: "View Master Plan", onClick: () => {}, variant: "outline" },
    { id: "qa-reports", label: "View Reports", onClick: () => {}, variant: "outline" },
    { id: "qa-events", label: "Manage Events", onClick: () => {}, variant: "outline" },
    { id: "qa-members", label: "Manage Members", onClick: () => {}, variant: "outline" },
  ];

  return { kpis, approvals, progress, statusSummary, events, activity, quickActions };
}

export function useChairpersonDashboard(): UseChairpersonDashboardResult {
  const query = useQuery({
    queryKey: ["dashboard", "chairperson"],
    queryFn: fetchChairpersonDashboard,
  });

  return {
    kpis: query.data?.kpis ?? [],
    approvals: query.data?.approvals ?? [],
    progress: query.data?.progress ?? [],
    statusSummary: query.data?.statusSummary ?? [],
    events: query.data?.events ?? [],
    activity: query.data?.activity ?? [],
    quickActions: query.data?.quickActions ?? [],
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch dashboard data") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
