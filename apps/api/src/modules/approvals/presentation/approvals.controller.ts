import { and, count, desc, eq, getDb, gte, sql } from "@repo/database";
import { events, planApprovals, reportSubmissions, users } from "@repo/database/schema";
import type { Request, Response } from "express";

/**
 * Unified Approvals Inbox (endpoints.md §2.5a, ADR-0018).
 * Aggregated read-only feed across the three executive approval domains:
 * plan changes (§2.22), report sign-offs (§2.5), event approvals (§2.5).
 * Review actions stay on the owning module endpoints; this feed only reads.
 */

type ApprovalDomain = "plan" | "report" | "event";

interface ApprovalFeedItem {
  id: string;
  domain: ApprovalDomain;
  title: string;
  resourceId: string;
  submittedBy: string | null;
  submittedByName: string | null;
  submittedAt: string;
  status: string;
  reviewHref: string;
}

async function fetchPlanApprovals(statusFilter: string | undefined): Promise<ApprovalFeedItem[]> {
  const db = getDb();
  const requester = users;
  const rows = await db
    .select({
      id: planApprovals.id,
      annualPlanId: planApprovals.annualPlanId,
      changeSummary: planApprovals.changeSummary,
      requestedBy: planApprovals.requestedBy,
      requesterName: requester.name,
      status: planApprovals.status,
      createdAt: planApprovals.createdAt,
    })
    .from(planApprovals)
    .leftJoin(requester, eq(requester.id, planApprovals.requestedBy))
    .where(statusFilter ? eq(planApprovals.status, statusFilter) : undefined)
    .orderBy(desc(planApprovals.createdAt))
    .limit(50);

  return rows.map((row) => ({
    id: row.id,
    domain: "plan" as const,
    title: row.changeSummary.slice(0, 120),
    resourceId: row.annualPlanId,
    submittedBy: row.requestedBy,
    submittedByName: row.requesterName ?? null,
    submittedAt: row.createdAt.toISOString(),
    status: row.status,
    reviewHref: `/api/v1/annual-plans/approvals/${row.id}/review`,
  }));
}

async function fetchReportSignoffs(statusFilter: string | undefined): Promise<ApprovalFeedItem[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: reportSubmissions.id,
      reportType: reportSubmissions.reportType,
      periodLabel: reportSubmissions.periodLabel,
      submittedBy: reportSubmissions.submittedBy,
      submitterName: users.name,
      status: reportSubmissions.status,
      createdAt: reportSubmissions.createdAt,
    })
    .from(reportSubmissions)
    .leftJoin(users, eq(users.id, reportSubmissions.submittedBy))
    .where(statusFilter ? eq(reportSubmissions.status, statusFilter) : undefined)
    .orderBy(desc(reportSubmissions.createdAt))
    .limit(50);

  return rows.map((row) => ({
    id: row.id,
    domain: "report" as const,
    title: `${row.reportType} report — ${row.periodLabel}`,
    resourceId: row.id,
    submittedBy: row.submittedBy,
    submittedByName: row.submitterName ?? null,
    submittedAt: row.createdAt.toISOString(),
    status: row.status,
    reviewHref: `/api/v1/reports/submissions/${row.id}/review`,
  }));
}

async function fetchEventApprovals(statusFilter: string | undefined): Promise<ApprovalFeedItem[]> {
  const db = getDb();
  // Events have no submitter/status columns; "pending" = unpublished future events.
  const rows = await db
    .select({
      id: events.id,
      eventName: events.eventName,
      eventDate: events.eventDate,
      isPublished: events.isPublished,
    })
    .from(events)
    .where(
      statusFilter === "Approved"
        ? eq(events.isPublished, true)
        : statusFilter === "Pending" || !statusFilter
          ? and(
              eq(events.isPublished, false),
              gte(events.eventDate, sql`now() - interval '30 days'`)
            )
          : undefined
    )
    .orderBy(desc(events.eventDate))
    .limit(50);

  return rows.map((row) => ({
    id: row.id,
    domain: "event" as const,
    title: row.eventName,
    resourceId: row.id,
    submittedBy: null,
    submittedByName: null,
    submittedAt: row.eventDate.toISOString(),
    status: row.isPublished ? "Approved" : "Pending",
    reviewHref: `/api/v1/events/${row.id}/approve`,
  }));
}

/** GET /approvals?status=&domain= — unified pending-approval feed. */
export async function listApprovals(req: Request, res: Response) {
  try {
    const status = req.query.status as string | undefined;
    const domain = req.query.domain as string | undefined;

    const domains: ApprovalDomain[] =
      domain === "plan" || domain === "report" || domain === "event"
        ? [domain]
        : ["plan", "report", "event"];

    const results = await Promise.all(
      domains.map((d) => {
        if (d === "plan") return fetchPlanApprovals(status);
        if (d === "report") return fetchReportSignoffs(status);
        return fetchEventApprovals(status);
      })
    );

    const items = results.flat().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: { code: "APPROVALS_ERROR", message } });
  }
}

/** GET /approvals/summary — counts per domain for badge widgets. */
export async function getApprovalsSummary(_req: Request, res: Response) {
  try {
    const db = getDb();
    const [pendingPlans, pendingReports, pendingEvents] = await Promise.all([
      db.select({ value: count() }).from(planApprovals).where(eq(planApprovals.status, "Pending")),
      db
        .select({ value: count() })
        .from(reportSubmissions)
        .where(eq(reportSubmissions.status, "Submitted")),
      db
        .select({ value: count() })
        .from(events)
        .where(and(eq(events.isPublished, false), gte(events.eventDate, sql`now()`))),
    ]);

    res.status(200).json({
      success: true,
      data: {
        plan: pendingPlans[0]?.value ?? 0,
        report: pendingReports[0]?.value ?? 0,
        event: pendingEvents[0]?.value ?? 0,
        total:
          (pendingPlans[0]?.value ?? 0) +
          (pendingReports[0]?.value ?? 0) +
          (pendingEvents[0]?.value ?? 0),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: { code: "APPROVALS_ERROR", message } });
  }
}
