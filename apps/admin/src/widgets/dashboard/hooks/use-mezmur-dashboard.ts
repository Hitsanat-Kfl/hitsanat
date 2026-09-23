"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  ActivityItem,
  EventItem,
  KPIData,
  ListItemData,
  QuickAction,
  StatusSummaryItem,
} from "@repo/ui";
import { type ApiResponse, type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type {
  AnnualMasterPlan,
  AttendanceSession,
  DistributionStatusItem,
  Event,
  SubDepartment,
  SubDepartmentMember,
  SubDeptDashboard,
} from "@/domains/definitions";
import { useAuditLogs } from "./use-audit-logs";

export interface UseMezmurDashboardResult {
  kpis: KPIData[];
  attentionItems: ListItemData[];
  distributionSummary: StatusSummaryItem[];
  sessionSummary: StatusSummaryItem[];
  responsibilities: ListItemData[];
  upcomingPrograms: EventItem[];
  activity: ActivityItem[];
  activityRestricted: boolean;
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" });
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa-roster",
    label: "Choir Roster",
    onClick: () => window.location.assign("/sub-departments/MEZMUR"),
    variant: "primary",
  },
  {
    id: "qa-dashboard",
    label: "Department Board",
    onClick: () => window.location.assign("/sub-departments/MEZMUR/dashboard"),
    variant: "outline",
  },
  {
    id: "qa-attendance",
    label: "Practice Attendance",
    onClick: () => window.location.assign("/attendance"),
    variant: "outline",
  },
  {
    id: "qa-events",
    label: "View Events & Awdemerit",
    onClick: () => window.location.assign("/events"),
    variant: "outline",
  },
  {
    id: "qa-planning",
    label: "Annual Planning",
    onClick: () => window.location.assign("/planning"),
    variant: "outline",
  },
  {
    id: "qa-reports",
    label: "View Reports",
    onClick: () => window.location.assign("/reports"),
    variant: "outline",
  },
];

interface MezmurDashboardData {
  kpis: KPIData[];
  attentionItems: ListItemData[];
  distributionSummary: StatusSummaryItem[];
  sessionSummary: StatusSummaryItem[];
  responsibilities: ListItemData[];
  upcomingPrograms: EventItem[];
}

async function fetchMezmurDashboard(): Promise<MezmurDashboardData> {
  const [departmentsRes, subDeptDashboardRes, rosterRes, plansRes, eventsRes, sessionsRes] =
    await Promise.allSettled([
      api.get<ApiResponse<SubDepartment[]>>("/sub-departments"),
      api.get<ApiResponse<SubDeptDashboard>>("/sub-departments/MEZMUR/dashboard"),
      api.get<ApiResponse<SubDepartmentMember[]>>("/sub-departments/MEZMUR/roster"),
      api.get<PaginatedResponse<AnnualMasterPlan>>("/annual-plans?limit=50"),
      api.get<PaginatedResponse<Event>>("/events?upcoming=true&limit=10"),
      api.get<PaginatedResponse<AttendanceSession>>("/attendance/sessions?limit=50"),
    ]);

  // The department and roster lookup is required for the Mezmur dashboard
  if (departmentsRes.status === "rejected") {
    throw departmentsRes.reason;
  }

  // Core department lookup
  let mezmurDeptId = "";
  if (departmentsRes.value.data) {
    const found = departmentsRes.value.data.find((d) => d.code === "MEZMUR");
    if (found) mezmurDeptId = found.id;
  }

  const roster: SubDepartmentMember[] =
    rosterRes.status === "fulfilled" ? (rosterRes.value.data ?? []) : [];
  const subDeptDashboard: SubDeptDashboard | null =
    subDeptDashboardRes.status === "fulfilled" ? (subDeptDashboardRes.value.data ?? null) : null;
  const plans: AnnualMasterPlan[] =
    plansRes.status === "fulfilled" ? (plansRes.value.data ?? []) : [];
  const events: Event[] = eventsRes.status === "fulfilled" ? (eventsRes.value.data ?? []) : [];
  const allSessions: AttendanceSession[] =
    sessionsRes.status === "fulfilled" ? (sessionsRes.value.data ?? []) : [];

  // Filter sessions for Mezmur (if subDeptId exists) or all sessions if not isolated
  const mezmurSessions = mezmurDeptId
    ? allSessions.filter((s) => s.subDepartmentId === mezmurDeptId)
    : allSessions;

  // Active plan distributions for Mezmur
  const activePlan = plans.find((p) => p.status === "Active") ?? null;
  let distributions: DistributionStatusItem[] = [];
  if (activePlan) {
    try {
      const distRes = await api.get<ApiResponse<DistributionStatusItem[]>>(
        `/annual-plans/${activePlan.id}/distributions`
      );
      const allDist = distRes.data ?? [];
      distributions = mezmurDeptId
        ? allDist.filter((d) => d.subDepartmentId === mezmurDeptId)
        : allDist;
    } catch {
      // Partial fallback
    }
  }

  // ---- 1. Attention / Preparation Required Items ----
  const attentionQueue: ListItemData[] = [];

  // Distributed activities assigned but not yet in progress
  const unstartedDistributions = distributions.filter((d) => d.status === "Assigned");
  for (const d of unstartedDistributions) {
    attentionQueue.push({
      id: `dist-${d.distributionId}`,
      primary: `${d.activityMainActivity} — Preparation Needed`,
      secondary: "Status: Assigned · Needs schedule and member assignments",
      trailing: formatDate(d.assignedAt),
      onClick: () => window.location.assign("/planning"),
    });
  }

  // Upcoming Awdemerit or Special events requiring program & song preparation
  const upcomingSpecialEvents = events.filter(
    (e) => e.eventType === "Awdemerit" || e.eventType === "Special" || e.eventType === "Adar"
  );
  for (const evt of upcomingSpecialEvents) {
    attentionQueue.push({
      id: `event-prep-${evt.id}`,
      primary: `${evt.eventName} (${evt.eventType.replaceAll("_", " ")})`,
      secondary: "Upcoming Ministry Program · Song & Repertoire Preparation Required",
      trailing: formatDate(evt.eventDate),
      onClick: () => window.location.assign("/events"),
    });
  }

  // Scheduled practice sessions requiring preparation
  const scheduledSessions = mezmurSessions.filter((s) => s.status === "Scheduled");
  for (const s of scheduledSessions) {
    attentionQueue.push({
      id: `session-${s.id}`,
      primary: `${s.topic || s.sessionType} — Scheduled Session`,
      secondary: `Practice / Worship Program · Status: Scheduled · ${formatDate(s.sessionDate)}`,
      trailing: formatDate(s.sessionDate),
      onClick: () => window.location.assign("/attendance"),
    });
  }

  // ---- 2. Overview KPIs ----
  const choirMembersCount =
    roster.length > 0 ? roster.length : (subDeptDashboard?.memberCount ?? 0);
  const activeAssignmentsCount = distributions.filter(
    (d) => d.status === "Assigned" || d.status === "In_Progress"
  ).length;
  const upcomingEventsCount = events.length;
  const pendingPrepCount = attentionQueue.length;

  const kpis: KPIData[] = [
    {
      label: "Choir Members",
      value: choirMembersCount,
      description: "Active choir roster",
    },
    {
      label: "Active Assignments",
      value: activeAssignmentsCount,
      description: activePlan ? `From ${activePlan.title}` : "Distributed responsibilities",
    },
    {
      label: "Upcoming Programs",
      value: upcomingEventsCount,
      description: `${upcomingSpecialEvents.length} special / Awdemerit`,
    },
    {
      label: "Pending Preparation",
      value: pendingPrepCount,
      description: "Require attention or prep",
      status: pendingPrepCount > 0 ? "warning" : "default",
    },
  ];

  // ---- 3. Summaries & Responsibilities ----
  const distAssigned = distributions.filter((d) => d.status === "Assigned").length;
  const distInProgress = distributions.filter((d) => d.status === "In_Progress").length;
  const distCompleted = distributions.filter((d) => d.status === "Completed").length;

  const distributionSummary: StatusSummaryItem[] = [
    { status: "assigned", label: "Assigned activities", count: distAssigned },
    { status: "in-progress", label: "In progress", count: distInProgress },
    { status: "completed", label: "Completed activities", count: distCompleted },
  ];

  const sessCompleted = mezmurSessions.filter((s) => s.status === "Completed").length;
  const sessScheduled = mezmurSessions.filter((s) => s.status === "Scheduled").length;
  const sessInProgress = mezmurSessions.filter((s) => s.status === "In_Progress").length;

  const sessionSummary: StatusSummaryItem[] = [
    { status: "completed", label: "Completed sessions", count: sessCompleted },
    { status: "in-progress", label: "In progress sessions", count: sessInProgress },
    { status: "assigned", label: "Scheduled sessions", count: sessScheduled },
  ];

  const responsibilities: ListItemData[] = distributions.map((d) => ({
    id: d.distributionId,
    primary: d.activityMainActivity,
    secondary: `Mezmur · Status: ${d.status.replaceAll("_", " ")}`,
    trailing: formatDate(d.assignedAt),
    onClick: activePlan ? () => window.location.assign(`/planning/${activePlan.id}`) : undefined,
  }));

  // ---- 4. Upcoming Programs & Events ----
  const upcomingPrograms: EventItem[] = events.map((evt) => ({
    id: evt.id,
    title: `${evt.eventName}${evt.eventType === "Awdemerit" ? " (አውደ-ምህረት)" : ""}`,
    date: evt.eventDate,
    time: new Date(evt.eventDate).toLocaleTimeString("en-ET", {
      hour: "numeric",
      minute: "2-digit",
    }),
  }));

  return {
    kpis,
    attentionItems: attentionQueue,
    distributionSummary,
    sessionSummary,
    responsibilities,
    upcomingPrograms,
  };
}

/**
 * Mezmur Leader Dashboard Data Hook — Phase 08 spec.
 *
 * Operational ministry workspace:
 * - Choir members & roster (GET /sub-departments/MEZMUR/roster, GET /sub-departments/MEZMUR/dashboard)
 * - Distributed plan responsibilities & progress (GET /annual-plans, GET /annual-plans/:id/distributions)
 * - Practice sessions & program attendance (GET /attendance/sessions?subDepartmentId=...)
 * - Upcoming ministry events & Awdemerit programs (GET /events?upcoming=true)
 * - Recent activity audit trail (GET /audit-logs)
 * - Verified operational quick actions
 */
export function useMezmurDashboard(): UseMezmurDashboardResult {
  const query = useQuery({
    queryKey: ["dashboard", "mezmur"],
    queryFn: fetchMezmurDashboard,
  });

  const { activity: auditActivity, loading: auditLoading, error: auditError } = useAuditLogs(6);

  return {
    kpis: query.data?.kpis ?? [],
    attentionItems: query.data?.attentionItems ?? [],
    distributionSummary: query.data?.distributionSummary ?? [],
    sessionSummary: query.data?.sessionSummary ?? [],
    responsibilities: query.data?.responsibilities ?? [],
    upcomingPrograms: query.data?.upcomingPrograms ?? [],
    activity: auditActivity,
    activityRestricted: !auditLoading && auditError !== null,
    quickActions: QUICK_ACTIONS,
    loading: query.isPending || query.isFetching,
    error: query.isError
      ? queryErrorMessage(query.error, "Failed to load Mezmur department data")
      : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
