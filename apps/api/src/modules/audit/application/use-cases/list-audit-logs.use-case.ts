import type {
  AuditLog,
  AuditLogRepository,
} from "../../domain/repositories/audit-log.repository.js";

export class ListAuditLogsUseCase {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async execute(params: { limit?: number }): Promise<AuditLog[]> {
    // Cap at 100 so the dashboard/overview stays lightweight.
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    return this.auditLogRepository.findRecent({ limit });
  }
}
