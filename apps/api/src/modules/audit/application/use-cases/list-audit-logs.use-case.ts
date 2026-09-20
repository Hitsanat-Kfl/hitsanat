import type {
  AuditLog,
  AuditLogPage,
  AuditLogQuery,
  AuditLogRepository,
} from "../../domain/repositories/audit-log.repository.js";

/**
 * PE-05 / FR-13.10: filtered, server-side paginated audit listing.
 */
export class ListAuditLogsUseCase {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async execute(params: {
    limit?: number;
    page?: number;
    action?: string;
    operatorId?: string;
    from?: string;
    to?: string;
  }): Promise<AuditLogPage> {
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const page = Math.max(params.page ?? 1, 1);
    const offset = (page - 1) * limit;

    const from = params.from ? this.parseDate(params.from) : undefined;
    const to = params.to ? this.parseDate(params.to) : undefined;

    const query: AuditLogQuery = {
      limit,
      offset,
      action: params.action || undefined,
      operatorId: params.operatorId || undefined,
      from,
      to,
    };

    return this.auditLogRepository.findMany(query);
  }

  private parseDate(value: string): Date | undefined {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
}

export type { AuditLog };
