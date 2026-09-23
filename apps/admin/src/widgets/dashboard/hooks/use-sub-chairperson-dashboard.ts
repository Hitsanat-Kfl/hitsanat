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
  DistributionStatusItem,
  PeriodicReport,
  PublicEvent,
  SubDepartment,
} from "@/domains/definitions";
import { useAuditLogs } from "./use-audit-logs";

export interface DepartmentStatus {
  id: string;
  code: string;
  nameEn: string;
  nameAm: string;
  /** Report pipeline counts for this department. */
  reportsTotal: number;
  reportsApproved: number;
  reportsInReview: number;
  reportsDraft: number;
  /** True when the department has no records at all yet. */
  empty: boolean;
}

export interface ReviewItem {
  id: string;
  kind: "Report" | "Plan";
  title: string;
  status: string;
  date: string;
}

export interface UseSubChairpersonDashboardResult {
  kpis: KPIData[];
  reviewItems: ListItemData[];
  reportSummary: StatusSummaryItem[];
  distributionSummary: StatusSummaryItem[];
  assignmentItems: ListItemData[];
  upcomingEvents: EventItem[];
  activity: ActivityItem[];
  activityRestricted: boolean;
  hasActivePlan: boolean;
  departmentBoard: ListItemData[];
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** Drill-down target for a department (spec §1.2 Department Status Board). */
export function departmentDrillDownHref(code: string): string {
  return `/sub-departments/${code}/dashboard`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" });
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa-subdepartments",
    label: "Sub-Departments",
    onClick: () => window.location.assign("/sub-departments"),
    variant: "outline",
  },
  {
    id: "qa-reports",
    label: "View Reports",
    onClick: () => window.location.assign("/reports"),
    variant: "outline",
  },
  {
    id: "qa-planning",
    label: "View Planning",
    onClick: () => window.location.assign("/planning"),
    variant: "outline",
  },
  {
    id: "qa-events",
    label: "View Events",
    onClick: () => window.location.assign("/events"),
    variant: "outline",
  },
];

interface SubChairpersonDashboardData {
  kpis: KPIData[];
  reviewItems: ListItemData[];
  reportSummary: StatusSummaryItem[];
  distributionSummary: StatusSummaryItem[];
  assignmentItems: ListItemData[];
  upcomingEvents: EventItem[];
  hasActivePlan: boolean;
  departmentBoard: ListItemData[];
}

async function fetchSubChairpersonDashboard(): Promise<SubChairpersonDashboardData> {
  const [departmentsRes, reportsRes, plansRes, eventsRes] = await Promise.allSettled([
    api.get<ApiResponse<SubDepartment[]>>("/sub-departments"),
    api.get<PaginatedResponse<PeriodicReport>>("/reports?limit=100"),
    api.get<PaginatedResponse<AnnualMasterPlan>>("/annual-plans?limit=50"),
    api.get<PaginatedResponse<PublicEvent>>("/events?upcoming=true&limit=5"),
  ]);

  // The department board is the core of this dashboard — without the
  // department list there is nothing truthful to render.
  if (departmentsRes.status === "rejected") {
    throw departmentsRes.reason;
  }

  const departments = departmentsRes.value.data ?? [];
  const reports = reportsRes.status === "fulfilled" ? (reportsRes.value.data ?? []) : [];
  const plans = plansRes.status === "fulfilled" ? (plansRes.value.data ?? []) : [];
  const events = eventsRes.status === "fulfilled" ? (eventsRes.value.data ?? []) : [];

  // ---- Active plan → real assignments (distributions) ----
  const activePlan = plans.find((p) => p.status === "Active") ?? null;
  const hasActivePlan = activePlan !== null;
  let distributions: DistributionStatusItem[] = [];
  if (activePlan) {
    try {
      const distRes = await api.get<ApiResponse<DistributionStatusItem[]>>(
        `/annual-plans/${activePlan.id}/distributions`
      );
      distributions = distRes.data ?? [];
    } catch {
      // Partial data: the board still renders without assignments.
    }
  }

  // ---- Department status board (group reports by department) ----
  const deptCodeById = new Map(departments.map((d) => [d.id, d.code]));
  const byDept = new Map<
    string,
    { total: number; approved: number; inReview: number; draft: number }
  >();
  for (const report of reports) {
    if (!report.subDepartmentId) continue;
    const bucket = byDept.get(report.subDepartmentId) ?? {
      total: 0,
      approved: 0,
      inReview: 0,
      draft: 0,
    };
    bucket.total += 1;
    if (report.status === "Approved") bucket.approved += 1;
    if (report.status === "Submitted" || report.status === "Reviewed") bucket.inReview += 1;
    if (report.status === "Draft") bucket.draft += 1;
    byDept.set(report.subDepartmentId, bucket);
  }

  const statuses: DepartmentStatus[] = departments.map((dept) => {
    const bucket = byDept.get(dept.id) ?? { total: 0, approved: 0, inReview: 0, draft: 0 };
    return {
      id: dept.id,
      code: dept.code,
      nameEn: dept.nameEn,
      nameAm: dept.nameAm,
      reportsTotal: bucket.total,
      reportsApproved: bucket.approved,
      reportsInReview: bucket.inReview,
      reportsDraft: bucket.draft,
      empty: bucket.total === 0,
    };
  });

  const departmentBoard: ListItemData[] = statuses.map((dept) => ({
    id: dept.id,
    primary: `${dept.nameEn} (${dept.nameAm})`,
    secondary: dept.empty
      ? "No reports yet"
      : `${dept.reportsApproved} approved · ${dept.reportsInReview} in review · ${dept.reportsDraft} draft`,
    trailing: dept.empty ? "—" : `${dept.reportsTotal}`,
    onClick: () => window.location.assign(departmentDrillDownHref(dept.code)),
  }));

  // ---- Report pipeline summary (delegated oversight, read-only) ----
  const approved = reports.filter((r) => r.status === "Approved").length;
  const inReview = reports.filter(
    (r) => r.status === "Submitted" || r.status === "Reviewed"
  ).length;
  const drafts = reports.filter((r) => r.status === "Draft").length;

  const reportSummary: StatusSummaryItem[] = [
    { status: "completed", label: "Approved reports", count: approved },
    { status: "in-progress", label: "In review", count: inReview },
    { status: "draft", label: "Drafts", count: drafts },
  ];

  // ---- Distribution progress (real BES-012 statuses, counts only) ----
  const assigned = distributions.filter((d) => d.status === "Assigned").length;
  const inProgress = distributions.filter((d) => d.status === "In_Progress").length;
  const completed = distributions.filter((d) => d.status === "Completed").length;
  const distributionSummary: StatusSummaryItem[] = [
    { status: "assigned", label: "Assigned", count: assigned },
    { status: "in-progress", label: "In progress", count: inProgress },
    { status: "completed", label: "Completed", count: completed },
  ];

  // ---- Responsibilities / assignments (real distributed activities) ----
  const assignmentItems: ListItemData[] = distributions.map((d) => ({
    id: d.distributionId,
    primary: d.activityMainActivity,
    secondary: `${deptCodeById.get(d.subDepartmentId) ?? "Sub-department"} · ${d.status.replaceAll("_", " ")}`,
    trailing: formatDate(d.assignedAt),
    onClick: activePlan ? () => window.location.assign(`/planning/${activePlan.id}`) : undefined,
  }));

  // ---- Items awaiting executive review (reports + plan drafts) ----
  const items: ReviewItem[] = [
    ...reports
      .filter((r) => r.status === "Submitted" || r.status === "Reviewed")
      .map((r) => ({
        id: r.id,
        kind: "Report" as const,
        title: `${r.reportType.replaceAll("_", " ")} — ${r.periodLabel}`,
        status: r.status,
        date: r.periodEnd,
      })),
    ...plans
      .filter((p) => p.status === "Draft")
      .map((p) => ({
        id: p.id,
        kind: "Plan" as const,
        title: p.title,
        status: p.status,
        date: p.createdAt,
      })),
  ];

  const reviewItems: ListItemData[] = items.map((item) => ({
    id: item.id,
    primary: `${item.kind}: ${item.title}`,
    secondary: item.status,
    trailing: formatDate(item.date),
  }));

  // ---- Upcoming activities (real events only) ----
  const upcomingEvents: EventItem[] = events.map((evt) => ({
    id: evt.id,
    title: evt.title,
    date: evt.eventDate,
    time: new Date(evt.eventDate).toLocaleTimeString("en-ET", {
      hour: "numeric",
      minute: "2-digit",
    }),
  }));

  // ---- Coordination KPIs (all real counts) ----
  const kpis: KPIData[] = [
    {
      label: "Sub-Departments",
      value: departments.length,
      description: "Programs under coordination",
    },
    {
      label: "Reports In Review",
      value: inReview,
      description: "Awaiting executive action",
    },
    {
      label: "Activities In Progress",
      value: inProgress,
      description: activePlan ? `From ${activePlan.title}` : "Distributed plan activities",
    },
    {
      label: "Upcoming Activities",
      value: events.length,
      description: "Scheduled events",
    },
  ];

  return {
    kpis,
    reviewItems,
    reportSummary,
    distributionSummary,
    assignmentItems,
    upcomingEvents,
    hasActivePlan,
    departmentBoard,
  };
}

/**
 * Sub-Chairperson (Vice-Chairperson) dashboard data — spec §1.2 + Phase 06.
 *
 * Sources (all real endpoints; no fabricated metrics):
 *  - GET /sub-departments              — the five programs
 *  - GET /reports                      — per-department report pipeline
 *  - GET /annual-plans                 — plan pipeline + active plan for distributions
 *  - GET /annual-plans/:id/distributions — real assignments (BES-012)
 *  - GET /events?upcoming=true         — upcoming activities
 *  - GET /audit-logs                   — recent activity (role-restricted)
 *
 * All grouping/counting happens here — no business logic in components.
 */
export function useSubChairpersonDashboard(): UseSubChairpersonDashboardResult {
  const query = useQuery({
    queryKey: ["dashboard", "sub-chairperson"],
    queryFn: fetchSubChairpersonDashboard,
  });

  // Recent activity (LEVEL 6): the audit trail is readable by
  // SUPER_ADMIN/CHAIRPERSON only, so this role gets a truthful
  // restricted notice instead of an empty or fabricated feed.
  const { activity: auditActivity, loading: auditLoading, error: auditError } = useAuditLogs(6);

  return {
    kpis: query.data?.kpis ?? [],
    reviewItems: query.data?.reviewItems ?? [],
    reportSummary: query.data?.reportSummary ?? [],
    distributionSummary: query.data?.distributionSummary ?? [],
    assignmentItems: query.data?.assignmentItems ?? [],
    upcomingEvents: query.data?.upcomingEvents ?? [],
    activity: auditActivity,
    activityRestricted: !auditLoading && auditError !== null,
    hasActivePlan: query.data?.hasActivePlan ?? false,
    departmentBoard: query.data?.departmentBoard ?? [],
    quickActions: QUICK_ACTIONS,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to load departments") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
