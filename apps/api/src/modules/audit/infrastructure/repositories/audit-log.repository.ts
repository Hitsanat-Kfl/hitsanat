import { desc, getDb } from "@repo/database";
import { auditLogs } from "@repo/database/schema";
import type {
  AuditActor,
  AuditLog,
  RecordAuditInput,
} from "../../domain/entities/audit-log.entity.js";
import type {
  AuditLogQuery,
  AuditLogRepository,
} from "../../domain/repositories/audit-log.repository.js";

type AuditLogRow = typeof auditLogs.$inferSelect;

function toDomain(row: AuditLogRow): AuditLog {
  return {
    id: row.id,
    operatorId: row.operatorId,
    action: row.action,
    resourceType: row.resourceType,
    resourceId: row.resourceId,
    payloadDiff: row.payloadDiff,
    ipAddress: row.ipAddress,
    timestamp: row.timestamp,
  };
}

export class DrizzleAuditLogRepository implements AuditLogRepository {
  async record(actor: AuditActor, input: RecordAuditInput): Promise<void> {
    const db = getDb();
    await db.insert(auditLogs).values({
      operatorId: actor.id,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      payloadDiff: input.payloadDiff ?? null,
      ipAddress: input.ipAddress ?? null,
    });
  }

  async findRecent(query?: AuditLogQuery): Promise<AuditLog[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(query?.limit ?? 20);
    return rows.map(toDomain);
  }
}
