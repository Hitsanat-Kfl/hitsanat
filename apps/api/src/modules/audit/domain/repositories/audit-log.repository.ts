import type { AuditActor, AuditLog, RecordAuditInput } from "../entities/audit-log.entity.js";

export type { AuditActor, AuditLog, RecordAuditInput };

export interface AuditLogQuery {
  limit?: number;
}

export interface AuditLogRepository {
  /** Appends one audit row. Called inside use-case flows, after the primary action succeeds. */
  record(actor: AuditActor, input: RecordAuditInput): Promise<void>;

  /** Most recent entries, newest first (dashboard + audit overview). */
  findRecent(query?: AuditLogQuery): Promise<AuditLog[]>;
}
