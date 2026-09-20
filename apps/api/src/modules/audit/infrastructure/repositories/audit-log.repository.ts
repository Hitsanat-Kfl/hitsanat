import { and, count, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "@repo/database";
import { auditLogs } from "@repo/database/schema";
import type {
  AuditActor,
  AuditLog,
  RecordAuditInput,
} from "../../domain/entities/audit-log.entity.js";
import type {
  AuditLogPage,
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

/** PE-05: shared filter builder for findRecent/findMany count+page queries. */
function buildWhere(query?: AuditLogQuery) {
  const conditions = [];
  if (query?.action) conditions.push(eq(auditLogs.action, query.action));
  if (query?.operatorId) conditions.push(eq(auditLogs.operatorId, query.operatorId));
  if (query?.from) conditions.push(gte(auditLogs.timestamp, query.from));
  if (query?.to) conditions.push(lte(auditLogs.timestamp, query.to));
  return conditions.length > 0 ? and(...conditions) : undefined;
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
      .where(buildWhere(query))
      .orderBy(desc(auditLogs.timestamp))
      .limit(query?.limit ?? 20);
    return rows.map(toDomain);
  }

  async findMany(query?: AuditLogQuery): Promise<AuditLogPage> {
    const db = getDb();
    const whereClause = buildWhere(query);
    const limit = Math.min(Math.max(query?.limit ?? 20, 1), 100);
    const offset = Math.max(query?.offset ?? 0, 0);

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(auditLogs)
        .where(whereClause)
        .orderBy(desc(auditLogs.timestamp))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(auditLogs).where(whereClause),
    ]);

    return {
      entries: rows.map(toDomain),
      total: countResult[0]?.value ?? 0,
    };
  }
}
