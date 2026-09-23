import { getDb, permissionGrants } from "@repo/database";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import type {
  CreatePermissionGrantRecord,
  PermissionGrant,
  PermissionGrantQuery,
  PermissionGrantPage,
  PermissionGrantRepository,
} from "../../domain/repositories/permission-grant.repository.js";

type PermissionGrantRow = typeof permissionGrants.$inferSelect;

function toDomain(row: PermissionGrantRow): PermissionGrant {
  return {
    id: row.id,
    userId: row.userId,
    resource: row.resource as PermissionGrant["resource"],
    action: row.action as PermissionGrant["action"],
    reason: row.reason,
    expiresAt: row.expiresAt,
    revokedAt: row.revokedAt,
    grantedBy: row.grantedBy,
    revokedBy: row.revokedBy,
    createdAt: row.createdAt,
  };
}

export class DrizzlePermissionGrantRepository implements PermissionGrantRepository {
  async create(record: CreatePermissionGrantRecord, grantedBy: string): Promise<PermissionGrant> {
    const db = getDb();
    const [row] = await db
      .insert(permissionGrants)
      .values({
        userId: record.userId,
        resource: record.resource,
        action: record.action,
        expiresAt: record.expiresAt,
        reason: record.reason ?? null,
        grantedBy,
      })
      .returning();
    return toDomain(row);
  }

  async findMany(query: PermissionGrantQuery = {}): Promise<PermissionGrantPage> {
    const db = getDb();
    const whereClause = query.userId ? eq(permissionGrants.userId, query.userId) : undefined;
    const limit = Math.min(Math.max(query.limit ?? 50, 1), 100);
    const offset = Math.max(query.offset ?? 0, 0);

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(permissionGrants)
        .where(whereClause)
        .orderBy(desc(permissionGrants.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(permissionGrants).where(whereClause),
    ]);

    return {
      entries: rows.map(toDomain),
      total: countResult[0]?.value ?? 0,
    };
  }

  async findById(id: string): Promise<PermissionGrant | null> {
    const db = getDb();
    const row = await db.query.permissionGrants.findFirst({
      where: eq(permissionGrants.id, id),
    });
    return row ? toDomain(row as PermissionGrantRow) : null;
  }

  async revoke(id: string, revokedBy: string, now: Date = new Date()): Promise<PermissionGrant> {
    const db = getDb();
    const [row] = await db
      .update(permissionGrants)
      .set({ revokedAt: now, revokedBy })
      .where(and(eq(permissionGrants.id, id), isNull(permissionGrants.revokedAt)))
      .returning();
    if (!row) {
      throw new Error(`Permission grant not found or already revoked: ${id}`);
    }
    return toDomain(row);
  }
}
