import type { Request, Response } from "express";
import { ListAuditLogsUseCase } from "../application/use-cases/list-audit-logs.use-case.js";
import { DrizzleAuditLogRepository } from "../infrastructure/repositories/audit-log.repository.js";
import type { AuditLog } from "../domain/repositories/audit-log.repository.js";

const repo = new DrizzleAuditLogRepository();

/** CSV export page size and safety cap so incidents can be reviewed in full. */
const CSV_PAGE_SIZE = 100;
const CSV_MAX_ROWS = 10_000;

/**
 * PE-05 / FR-13.10: audit trail listing with filters (action, actor,
 * date range), server-side pagination, and CSV export.
 */
export async function listAuditLogs(req: Request, res: Response) {
  try {
    const useCase = new ListAuditLogsUseCase(repo);
    const format = req.query.format === "csv" ? "csv" : "json";

    const filters = {
      action: req.query.action as string | undefined,
      operatorId: req.query.operatorId as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
    };

    if (format === "csv") {
      // Export pulls every matching row up to the safety cap by walking
      // server-side pages — a single 100-row page would silently truncate
      // incident reviews.
      const entries: AuditLog[] = [];
      let page = 1;
      let total = Number.POSITIVE_INFINITY;
      while (entries.length < Math.min(total, CSV_MAX_ROWS)) {
        const result = await useCase.execute({ ...filters, limit: CSV_PAGE_SIZE, page });
        total = result.total;
        entries.push(...result.entries);
        if (result.entries.length < CSV_PAGE_SIZE) break;
        page += 1;
      }

      res.status(200).setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`
      );
      return res.send(toCsv(entries.slice(0, CSV_MAX_ROWS)));
    }

    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const result = await useCase.execute({
      ...filters,
      limit,
      page: req.query.page ? Number(req.query.page) : undefined,
    });

    const page = req.query.page ? Number(req.query.page) : 1;
    const effectiveLimit = limit ?? 20;
    res.status(200).json({
      success: true,
      data: result.entries,
      pagination: {
        page,
        limit: effectiveLimit,
        total: result.total,
        totalPages: Math.max(Math.ceil(result.total / effectiveLimit), 1),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: { code: "INTERNAL", message } });
  }
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function toCsv(entries: AuditLog[]): string {
  const header =
    "id,timestamp,operator_id,action,resource_type,resource_id,payload_diff,ip_address";
  const rows = entries.map((entry) =>
    [
      entry.id,
      entry.timestamp.toISOString(),
      entry.operatorId,
      entry.action,
      entry.resourceType,
      entry.resourceId,
      entry.payloadDiff ?? "",
      entry.ipAddress ?? "",
    ]
      .map((cell) => csvEscape(String(cell)))
      .join(",")
  );
  return [header, ...rows].join("\r\n");
}
