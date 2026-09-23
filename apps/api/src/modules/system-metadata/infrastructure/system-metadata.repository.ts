import { desc, eq } from "@repo/database";
import { systemMetadata } from "@repo/database/schema";

export interface SystemMetadataRow {
  key: string;
  value: string;
  updatedAt: Date;
}

export interface SystemMetadataRepository {
  list(): Promise<SystemMetadataRow[]>;
  findByKey(key: string): Promise<SystemMetadataRow | null>;
  upsert(key: string, value: string): Promise<SystemMetadataRow>;
}

/**
 * FR-13.4 seed/migration status panel — reads the existing
 * `system_metadata` table (no schema change required).
 */
export class DrizzleSystemMetadataRepository implements SystemMetadataRepository {
  async list(): Promise<SystemMetadataRow[]> {
    const db = (await import("@repo/database")).getDb();
    const rows = await db
      .select({
        key: systemMetadata.key,
        value: systemMetadata.value,
        updatedAt: systemMetadata.updatedAt,
      })
      .from(systemMetadata)
      .orderBy(desc(systemMetadata.updatedAt));
    return rows;
  }

  async findByKey(key: string): Promise<SystemMetadataRow | null> {
    const db = (await import("@repo/database")).getDb();
    const rows = await db
      .select({
        key: systemMetadata.key,
        value: systemMetadata.value,
        updatedAt: systemMetadata.updatedAt,
      })
      .from(systemMetadata)
      .where(eq(systemMetadata.key, key))
      .limit(1);
    return rows[0] ?? null;
  }

  async upsert(key: string, value: string): Promise<SystemMetadataRow> {
    const db = (await import("@repo/database")).getDb();
    const rows = await db
      .insert(systemMetadata)
      .values({ key, value })
      .onConflictDoUpdate({
        target: systemMetadata.key,
        set: { value, updatedAt: new Date() },
      })
      .returning({
        key: systemMetadata.key,
        value: systemMetadata.value,
        updatedAt: systemMetadata.updatedAt,
      });
    return rows[0];
  }
}
