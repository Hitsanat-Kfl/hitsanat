"use client";

import { useCallback, useEffect, useState } from "react";
import type { KPIData, ListItemData, QuickAction, StatusSummaryItem } from "@repo/ui";
import { type ApiResponse, type PaginatedResponse, api } from "@/lib/api-client";
import type { AnnualMasterPlan, PeriodicReport, SubDepartment } from "@/lib/types";

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

/**
 * Vice-Chairperson (Sub-Chairperson) dashboard data — spec §1.2.
 *
 * Sources (all real endpoints; no fabricated metrics):
 *  - GET /sub-departments — the five programs
 *  - GET /reports         — per-department report pipeline (oversight)
 *  - GET /annual-plans    — plan pipeline (drafts awaiting executive action)
 */
export function useSubChairpersonDashboard(): UseSubChairpersonDashboardResult {
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [reviewItems, setReviewItems] = useState<ListItemData[]>([]);
  const [reportSummary, setReportSummary] = useState<StatusSummaryItem[]>([]);
  const [departmentBoard, setDepartmentBoard] = useState<ListItemData[]>([]);
  const [quickActions] = useState<QuickAction[]>([
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
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [departmentsRes, reportsRes, plansRes] = await Promise.allSettled([
      api.get<ApiResponse<SubDepartment[]>>("/sub-departments"),
      api.get<PaginatedResponse<PeriodicReport>>("/reports?limit=100"),
      api.get<PaginatedResponse<AnnualMasterPlan>>("/annual-plans?limit=50"),
    ]);

    // The department board is the core of this dashboard — without the
    // department list there is nothing truthful to render.
    if (departmentsRes.status === "rejected") {
      const reason = departmentsRes.reason;
      setError(reason instanceof Error ? reason.message : "Failed to load departments");
      setLoading(false);
      return;
    }

    const departments = departmentsRes.value.data ?? [];
    const reports = reportsRes.status === "fulfilled" ? (reportsRes.value.data ?? []) : [];
    const plans = plansRes.status === "fulfilled" ? (plansRes.value.data ?? []) : [];

    // ---- Department status board (group reports by department) ----
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

    setDepartmentBoard(
      statuses.map((dept) => ({
        id: dept.id,
        primary: `${dept.nameEn} (${dept.nameAm})`,
        secondary: dept.empty
          ? "No reports yet"
          : `${dept.reportsApproved} approved · ${dept.reportsInReview} in review · ${dept.reportsDraft} draft`,
        trailing: dept.empty ? "—" : `${dept.reportsTotal}`,
        onClick: () => window.location.assign(departmentDrillDownHref(dept.code)),
      }))
    );

    // ---- Report pipeline summary (delegated oversight, read-only) ----
    const approved = reports.filter((r) => r.status === "Approved").length;
    const inReview = reports.filter(
      (r) => r.status === "Submitted" || r.status === "Reviewed"
    ).length;
    const drafts = reports.filter((r) => r.status === "Draft").length;

    setReportSummary([
      { status: "completed", label: "Approved reports", count: approved },
      { status: "in-progress", label: "In review", count: inReview },
      { status: "draft", label: "Drafts", count: drafts },
    ]);

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

    setReviewItems(
      items.map((item) => ({
        id: item.id,
        primary: `${item.kind}: ${item.title}`,
        secondary: item.status,
        trailing: formatDate(item.date),
      }))
    );

    // ---- KPIs ----
    const activePlans = plans.filter((p) => p.status === "Active").length;
    setKpis([
      {
        label: "Sub-Departments",
        value: departments.length,
        description: "Programs under oversight",
      },
      {
        label: "Reports In Review",
        value: inReview,
        description: "Submitted or reviewed, awaiting action",
      },
      {
        label: "Plan Drafts",
        value: plans.filter((p) => p.status === "Draft").length,
        description: "Awaiting executive review",
      },
      {
        label: "Active Plans",
        value: activePlans,
        description: "Currently in execution",
      },
    ]);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    kpis,
    reviewItems,
    reportSummary,
    departmentBoard,
    quickActions,
    loading,
    error,
    refresh: fetchData,
  };
}
