import type { AuditActor, AuditLog, RecordAuditInput } from "../entities/audit-log.entity.js";

export type { AuditActor, AuditLog, RecordAuditInput };

/**
 * PE-05 / FR-13.10: audit trail query filters.
 */
export interface AuditLogQuery {
  limit?: number;
  offset?: number;
  /** Exact action code (e.g. USER_DEACTIVATED). */
  action?: string;
  /** Actor (operator) user id. */
  operatorId?: string;
  /** Inclusive lower bound on timestamp. */
  from?: Date;
  /** Inclusive upper bound on timestamp. */
  to?: Date;
}

export interface AuditLogPage {
  entries: AuditLog[];
  total: number;
}

export interface AuditLogRepository {
  /** Appends one audit row. Called inside use-case flows, after the primary action succeeds. */
  record(actor: AuditActor, input: RecordAuditInput): Promise<void>;

  /** Most recent entries, newest first (dashboard + audit overview). */
  findRecent(query?: AuditLogQuery): Promise<AuditLog[]>;

  /** PE-05: filtered, paginated listing with total count. */
  findMany(query?: AuditLogQuery): Promise<AuditLogPage>;
}
