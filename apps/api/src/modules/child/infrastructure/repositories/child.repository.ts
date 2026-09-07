import { and, count, desc, eq, getDb, ilike, or, sql } from "@repo/database";
import { children, childParents, parents } from "@repo/database/schema";
import type { Child, ChildParent, Parent } from "@repo/domain";
import type {
  ChildRepository,
  PaginationParams,
  PaginatedResponse,
  ParentWithRelation,
} from "../../domain/repositories/child.repository.js";

function toDomain(row: typeof children.$inferSelect): Child {
  return {
    id: row.id,
    fullName: row.fullName,
    christianName: row.christianName,
    gender: row.gender as Child["gender"],
    dateOfBirth: new Date(row.dateOfBirth),
    address: row.address,
    kutrGroup: row.kutrGroup as Child["kutrGroup"],
    collectionLocation: row.collectionLocation as Child["collectionLocation"],
    photoUrl: row.photoUrl ?? undefined,
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

export class DrizzleChildRepository implements ChildRepository {
  async findById(id: string): Promise<Child | null> {
    const db = getDb();
    const rows = await db.select().from(children).where(eq(children.id, id)).limit(1);
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async findMany(params: PaginationParams): Promise<PaginatedResponse<Child>> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const searchCondition = params.search
      ? or(
          ilike(children.fullName, `%${params.search}%`),
          ilike(children.christianName, `%${params.search}%`)
        )
      : undefined;

    const whereClause = searchCondition ? and(searchCondition) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(children)
        .where(whereClause)
        .orderBy(desc(children.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(children).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toDomain),
      pagination: { page, limit, total, totalPages },
    };
  }

  async create(data: Omit<Child, "id" | "createdAt">): Promise<Child> {
    const db = getDb();
    const rows = await db
      .insert(children)
      .values({
        fullName: data.fullName,
        christianName: data.christianName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth.toISOString().split("T")[0],
        address: data.address,
        kutrGroup: data.kutrGroup,
        collectionLocation: data.collectionLocation,
        photoUrl: data.photoUrl ?? null,
        isActive: data.isActive,
      })
      .returning();
    return toDomain(rows[0]);
  }

  async update(id: string, data: Partial<Omit<Child, "id" | "createdAt">>): Promise<Child> {
    const db = getDb();
    const updateData: Record<string, unknown> = { ...data };
    if (data.photoUrl !== undefined) {
      updateData.photoUrl = data.photoUrl ?? null;
    }
    if (data.dateOfBirth instanceof Date) {
      updateData.dateOfBirth = data.dateOfBirth.toISOString().split("T")[0];
    }
    const rows = await db.update(children).set(updateData).where(eq(children.id, id)).returning();
    if (rows.length === 0) {
      throw new Error(`Child with id ${id} not found`);
    }
    return toDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    const db = getDb();
    const rows = await db.delete(children).where(eq(children.id, id)).returning();
    if (rows.length === 0) {
      throw new Error(`Child with id ${id} not found`);
    }
  }

  async findByParent(parentId: string): Promise<Child[]> {
    const db = getDb();
    const rows = await db
      .select({ child: children })
      .from(childParents)
      .innerJoin(children, eq(childParents.childId, children.id))
      .where(eq(childParents.parentId, parentId));
    return rows.map((r) => toDomain(r.child));
  }

  async findActive(): Promise<Child[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(children)
      .where(eq(children.isActive, true))
      .orderBy(desc(children.createdAt));
    return rows.map(toDomain);
  }

  async findActiveByBirthdayMonth(month: number): Promise<Child[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(children)
      .where(
        and(
          eq(children.isActive, true),
          sql`EXTRACT(MONTH FROM ${children.dateOfBirth}) = ${month}`
        )
      )
      .orderBy(desc(children.dateOfBirth));
    return rows.map(toDomain);
  }

  async createParent(data: Omit<Parent, "id" | "createdAt">): Promise<Parent> {
    const db = getDb();
    const rows = await db
      .insert(parents)
      .values({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        secondaryPhone: data.secondaryPhone ?? null,
        address: data.address,
        occupation: data.occupation ?? null,
        notes: data.notes ?? null,
      })
      .returning();
    return rows[0] as Parent;
  }

  async findAllParents(): Promise<Parent[]> {
    const db = getDb();
    const rows = await db.select().from(parents);
    return rows as Parent[];
  }

  async findParentById(id: string): Promise<Parent | null> {
    const db = getDb();
    const rows = await db.select().from(parents).where(eq(parents.id, id)).limit(1);
    return rows.length > 0 ? (rows[0] as Parent) : null;
  }

  async findLinkByChildAndRelation(childId: string, relation: string): Promise<ChildParent | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(childParents)
      .where(
        and(
          eq(childParents.childId, childId),
          eq(childParents.relation, relation as "Father" | "Mother")
        )
      )
      .limit(1);
    return rows.length > 0 ? (rows[0] as ChildParent) : null;
  }

  async findLinkByChildAndParent(childId: string, parentId: string): Promise<ChildParent | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(childParents)
      .where(and(eq(childParents.childId, childId), eq(childParents.parentId, parentId)))
      .limit(1);
    return rows.length > 0 ? (rows[0] as ChildParent) : null;
  }

  async createLink(data: {
    childId: string;
    parentId: string;
    relation: string;
  }): Promise<ChildParent> {
    const db = getDb();
    const rows = await db
      .insert(childParents)
      .values({
        childId: data.childId,
        parentId: data.parentId,
        relation: data.relation as "Father" | "Mother",
      })
      .returning();
    return rows[0] as ChildParent;
  }

  async deleteLink(id: string): Promise<void> {
    const db = getDb();
    await db.delete(childParents).where(eq(childParents.id, id));
  }

  async findLinkById(id: string): Promise<ChildParent | null> {
    const db = getDb();
    const rows = await db.select().from(childParents).where(eq(childParents.id, id)).limit(1);
    return rows.length > 0 ? (rows[0] as ChildParent) : null;
  }

  async findParentsByChild(childId: string): Promise<ParentWithRelation[]> {
    const db = getDb();
    const rows = await db
      .select({
        childParent: childParents,
        parent: parents,
      })
      .from(childParents)
      .innerJoin(parents, eq(childParents.parentId, parents.id))
      .where(eq(childParents.childId, childId));

    return rows.map((row) => ({
      id: row.parent.id,
      fullName: row.parent.fullName,
      phoneNumber: row.parent.phoneNumber,
      secondaryPhone: row.parent.secondaryPhone ?? undefined,
      address: row.parent.address,
      occupation: row.parent.occupation ?? undefined,
      notes: row.parent.notes ?? undefined,
      createdAt: row.parent.createdAt,
      relation: row.childParent.relation as "Father" | "Mother",
      childParentId: row.childParent.id,
    }));
  }
}
