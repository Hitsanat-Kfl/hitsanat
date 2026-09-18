import type { Request, Response } from "express";
import { ListAuditLogsUseCase } from "../application/use-cases/list-audit-logs.use-case.js";
import { DrizzleAuditLogRepository } from "../infrastructure/repositories/audit-log.repository.js";

const repo = new DrizzleAuditLogRepository();

export async function listAuditLogs(req: Request, res: Response) {
  try {
    const useCase = new ListAuditLogsUseCase(repo);
    const logs = await useCase.execute({
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: { code: "INTERNAL", message } });
  }
}
