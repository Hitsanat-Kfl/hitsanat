import { and, count, desc, eq, getDb, ilike, or } from "@repo/database";
import { families } from "@repo/database/schema";
import type { Family } from "../../domain/entities/family.entity.js";
import type { FamilyRepository } from "../../domain/repositories/family.repository.js";

function toDomain(row: typeof families.$inferSelect): Family {
  return {
    id: row.id,
    familyName: row.familyName,
    fatherMemberId: row.fatherMemberId,
    motherMemberId: row.motherMemberId,
    academicYear: row.academicYear,
    createdAt: row.createdAt,
  };
}

export class DrizzleFamilyRepository implements FamilyRepository {
  async findById(id: string): Promise<Family | null> {
    const db = getDb();
    const rows = await db.select().from(families).where(eq(families.id, id)).limit(1);
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async findMany(params: { page?: number; limit?: number; search?: string }) {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const searchCondition = params.search
      ? or(
          ilike(families.familyName, `%${params.search}%`),
          ilike(families.academicYear, `%${params.search}%`)
        )
      : undefined;

    const whereClause = searchCondition ? and(searchCondition) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(families)
        .where(whereClause)
        .orderBy(desc(families.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(families).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toDomain),
      pagination: { page, limit, total, totalPages },
    };
  }

  async create(data: Omit<Family, "id" | "createdAt">): Promise<Family> {
    const db = getDb();
    const rows = await db
      .insert(families)
      .values({
        familyName: data.familyName,
        fatherMemberId: data.fatherMemberId,
        motherMemberId: data.motherMemberId,
        academicYear: data.academicYear,
      })
      .returning();
    return toDomain(rows[0]);
  }

  async update(id: string, data: Partial<Omit<Family, "id" | "createdAt">>): Promise<Family> {
    const db = getDb();
    const rows = await db
      .update(families)
      .set(data)
      .where(eq(families.id, id))
      .returning();
    if (rows.length === 0) {
      throw new Error(`Family with id ${id} not found`);
    }
    return toDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    const db = getDb();
    const rows = await db.delete(families).where(eq(families.id, id)).returning();
    if (rows.length === 0) {
      throw new Error(`Family with id ${id} not found`);
    }
  }
}
