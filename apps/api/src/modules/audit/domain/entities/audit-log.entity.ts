/**
 * A single administrative action recorded in the system audit trail.
 * Append-only: rows are never updated or deleted through the API.
 */
export interface AuditLog {
  id: string;
  /** Auth user id of the actor (no FK — rows survive user deletion). */
  operatorId: string;
  /** Machine-readable action verb, e.g. "USER_CREATED". */
  action: string;
  /** Affected record type, e.g. "user". */
  resourceType: string;
  /** Auth/local user id of the affected record (stable across sources). */
  resourceId: string;
  /** Free-form detail, e.g. target email/role. Never secrets. */
  payloadDiff: string | null;
  ipAddress: string | null;
  timestamp: Date;
}

export interface AuditActor {
  id: string;
  email: string;
}

export interface RecordAuditInput {
  action: string;
  resourceType: string;
  resourceId: string;
  payloadDiff?: string;
  ipAddress?: string;
}
