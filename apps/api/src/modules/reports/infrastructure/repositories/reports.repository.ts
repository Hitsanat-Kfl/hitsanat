import { and, count, desc, eq, getDb, ilike } from "@repo/database";
import { periodicReports, reportSubmissions } from "@repo/database/schema";
import type { PeriodicReport, ReportMetrics, ReportSubmission } from "@repo/domain";
import type { ReportsRepository } from "../../domain/repositories/reports.repository.js";

function toReport(row: typeof periodicReports.$inferSelect): PeriodicReport {
  return {
    id: row.id,
    reportType: row.reportType as PeriodicReport["reportType"],
    periodLabel: row.periodLabel,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    subDepartmentId: row.subDepartmentId ?? undefined,
    generatedBy: row.generatedBy,
    status: row.status as PeriodicReport["status"],
    metrics: (row.metrics as ReportMetrics) ?? undefined,
    challenges: row.challenges ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
  };
}

export class DrizzleReportsRepository implements ReportsRepository {
  async findReportById(id: string): Promise<PeriodicReport | null> {
    const db = getDb();
    const rows = await db.select().from(periodicReports).where(eq(periodicReports.id, id)).limit(1);
    return rows.length > 0 ? toReport(rows[0]) : null;
  }

  async findManyReports(params: {
    page?: number;
    limit?: number;
    reportType?: string;
    subDepartmentId?: string;
  }): Promise<{
    success: boolean;
    data: PeriodicReport[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const conditions = [];
    if (params.reportType) {
      conditions.push(eq(periodicReports.reportType, params.reportType));
    }
    if (params.subDepartmentId) {
      conditions.push(eq(periodicReports.subDepartmentId, params.subDepartmentId));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(periodicReports)
        .where(whereClause)
        .orderBy(desc(periodicReports.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(periodicReports).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toReport),
      pagination: { page, limit, total, totalPages },
    };
  }

  async createReport(data: {
    reportType: string;
    periodLabel: string;
    periodStart: Date;
    periodEnd: Date;
    subDepartmentId?: string;
    generatedBy: string;
    status: string;
    metrics?: ReportMetrics;
    challenges?: string;
    notes?: string;
  }): Promise<PeriodicReport> {
    const db = getDb();
    const rows = await db
      .insert(periodicReports)
      .values({
        reportType: data.reportType,
        periodLabel: data.periodLabel,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        subDepartmentId: data.subDepartmentId ?? null,
        generatedBy: data.generatedBy,
        status: data.status,
        metrics: data.metrics ? JSON.stringify(data.metrics) : null,
        challenges: data.challenges ?? null,
        notes: data.notes ?? null,
      })
      .returning();
    return toReport(rows[0]);
  }

  async updateReport(
    id: string,
    data: Partial<{
      status: string;
      metrics: ReportMetrics;
      challenges: string;
      notes: string;
    }>
  ): Promise<PeriodicReport> {
    const db = getDb();
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.metrics !== undefined) updateData.metrics = JSON.stringify(data.metrics);
    if (data.challenges !== undefined) updateData.challenges = data.challenges;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const rows = await db
      .update(periodicReports)
      .set(updateData)
      .where(eq(periodicReports.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`Report not found: ${id}`);
    }
    return toReport(rows[0]);
  }

  async deleteReport(id: string): Promise<void> {
    const db = getDb();
    const rows = await db.delete(periodicReports).where(eq(periodicReports.id, id)).returning();
    if (rows.length === 0) {
      throw new Error(`Report not found: ${id}`);
    }
  }

  async createSubmission(data: {
    reportType: string;
    periodLabel: string;
    subDepartmentId: string;
    submittedBy: string;
    metrics?: ReportMetrics;
    challenges?: string;
    notes?: string;
  }): Promise<ReportSubmission> {
    const db = getDb();
    const rows = await db
      .insert(reportSubmissions)
      .values({
        reportType: data.reportType,
        periodLabel: data.periodLabel,
        subDepartmentId: data.subDepartmentId,
        submittedBy: data.submittedBy,
        status: "Submitted",
        metrics: data.metrics ? JSON.stringify(data.metrics) : null,
        challenges: data.challenges ?? null,
        notes: data.notes ?? null,
      })
      .returning();
    return toSubmission(rows[0]);
  }

  async findSubmissionById(id: string): Promise<ReportSubmission | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(reportSubmissions)
      .where(eq(reportSubmissions.id, id))
      .limit(1);
    return rows.length > 0 ? toSubmission(rows[0]) : null;
  }

  async findManySubmissions(params: {
    page?: number;
    limit?: number;
    subDepartmentId?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: ReportSubmission[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const conditions = [];
    if (params.subDepartmentId) {
      conditions.push(eq(reportSubmissions.subDepartmentId, params.subDepartmentId));
    }
    if (params.status) {
      conditions.push(eq(reportSubmissions.status, params.status));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(reportSubmissions)
        .where(whereClause)
        .orderBy(desc(reportSubmissions.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(reportSubmissions).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toSubmission),
      pagination: { page, limit, total, totalPages },
    };
  }

  async reviewSubmission(
    id: string,
    data: { reviewedBy: string; status: string }
  ): Promise<ReportSubmission> {
    const db = getDb();
    const rows = await db
      .update(reportSubmissions)
      .set({
        status: data.status,
        reviewedBy: data.reviewedBy,
        reviewedAt: new Date(),
      })
      .where(eq(reportSubmissions.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`Submission not found: ${id}`);
    }
    return toSubmission(rows[0]);
  }
}

function toSubmission(row: typeof reportSubmissions.$inferSelect): ReportSubmission {
  return {
    id: row.id,
    reportType: row.reportType as ReportSubmission["reportType"],
    periodLabel: row.periodLabel,
    subDepartmentId: row.subDepartmentId,
    submittedBy: row.submittedBy,
    status: row.status as ReportSubmission["status"],
    metrics: (row.metrics as ReportMetrics) ?? undefined,
    challenges: row.challenges ?? undefined,
    notes: row.notes ?? undefined,
    reviewedBy: row.reviewedBy ?? undefined,
    reviewedAt: row.reviewedAt ?? undefined,
    createdAt: row.createdAt,
  };
}
