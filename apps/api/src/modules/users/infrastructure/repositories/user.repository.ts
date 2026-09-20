import { and, count, desc, eq, ilike, inArray, or } from "@repo/database";
import {
  families,
  members,
  subDepartmentMembers,
  subDepartments,
  users,
} from "@repo/database/schema";
import type { CreateUserInput, UpdateUserInput } from "@repo/validation";
import type {
  UserRepository,
  UserWithSubDepartments,
} from "../../domain/repositories/user.repository.js";
import type { CreateUserWithMemberInput } from "../../domain/repositories/user.repository.js";

type UserRow = typeof users.$inferSelect;

async function hydrate(row: UserRow): Promise<UserWithSubDepartments> {
  const db = (await import("@repo/database")).getDb();

  const subDepts = row.memberId
    ? await db
        .select({
          subDepartmentId: subDepartments.id,
          code: subDepartments.code,
          nameEn: subDepartments.nameEn,
          role: subDepartmentMembers.role,
        })
        .from(subDepartmentMembers)
        .innerJoin(subDepartments, eq(subDepartmentMembers.subDepartmentId, subDepartments.id))
        .where(eq(subDepartmentMembers.memberId, row.memberId))
    : [];

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    memberId: row.memberId,
    emailVerified: row.emailVerified,
    status: (row.status === "DEACTIVATED" ? "DEACTIVATED" : "ACTIVE") as "ACTIVE" | "DEACTIVATED",
    deactivatedAt: row.deactivatedAt,
    image: row.image,
    subDepartments: subDepts,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DrizzleUserRepository implements UserRepository {
  async findById(id: string): Promise<UserWithSubDepartments | null> {
    const db = (await import("@repo/database")).getDb();
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows.length > 0 ? hydrate(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<UserWithSubDepartments | null> {
    const db = (await import("@repo/database")).getDb();
    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return rows.length > 0 ? hydrate(rows[0]) : null;
  }

  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{ users: UserWithSubDepartments[]; total: number }> {
    const db = (await import("@repo/database")).getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const conditions = [];
    if (params.search) {
      conditions.push(
        or(ilike(users.name, `%${params.search}%`), ilike(users.email, `%${params.search}%`))
      );
    }
    if (params.role) {
      conditions.push(eq(users.role, params.role));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(users).where(whereClause),
    ]);

    return {
      users: await Promise.all(rows.map(hydrate)),
      total: countResult[0]?.value ?? 0,
    };
  }

  async create(
    authUserId: string,
    data: CreateUserWithMemberInput
  ): Promise<UserWithSubDepartments> {
    const db = (await import("@repo/database")).getDb();

    // BR-007: the linked member must exist and be active.
    if (data.memberId) {
      const memberRows = await db
        .select({ id: members.id, isActive: members.isActive })
        .from(members)
        .where(eq(members.id, data.memberId))
        .limit(1);
      if (memberRows.length === 0) {
        throw new Error(`Member not found: ${data.memberId}`);
      }
      if (!memberRows[0].isActive) {
        throw new Error(
          `BR-007 violation: member ${data.memberId} is not active — cannot be linked to a leadership account`
        );
      }
    }

    const rows = await db
      .insert(users)
      .values({
        id: authUserId,
        name: data.name,
        email: data.email,
        role: data.role,
        status: "ACTIVE",
        memberId: data.memberId,
        image: data.imageUrl ?? null,
        emailVerified: true,
      })
      .returning();

    if (data.subDepartmentIds && data.subDepartmentIds.length > 0 && data.memberId) {
      await this.setSubDepartments(data.memberId, data.subDepartmentIds);
    }

    return hydrate(rows[0]);
  }

  async update(id: string, data: UpdateUserInput): Promise<UserWithSubDepartments> {
    const db = (await import("@repo/database")).getDb();

    // BR-007: if promoting to a leadership role, memberId must be present
    // (either in this update or already on the row).
    if (data.role) {
      const leadershipRoles = ["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"];
      if (leadershipRoles.includes(data.role)) {
        const current = await db.select().from(users).where(eq(users.id, id)).limit(1);
        const effectiveMemberId =
          data.memberId !== undefined ? data.memberId : (current[0]?.memberId ?? null);
        if (!effectiveMemberId) {
          throw new Error(
            "BR-007 violation: leadership accounts must be linked to a registered member"
          );
        }
      }
    }

    const rows = await db
      .update(users)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.memberId !== undefined ? { memberId: data.memberId } : {}),
        ...(data.imageUrl !== undefined ? { image: data.imageUrl } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`User not found: ${id}`);
    }

    if (data.subDepartmentIds !== undefined) {
      const targetMemberId = data.memberId !== undefined ? data.memberId : rows[0].memberId;
      if (targetMemberId) {
        await this.setSubDepartments(targetMemberId, data.subDepartmentIds);
      }
    }

    return hydrate(rows[0]);
  }

  /**
   * BR-002: replace the member's sub-department assignments.
   * Assigns the given sub-departments with role "Member" for any
   * sub-department the member is not yet part of; existing rows
   * (with their leadership roles) are preserved.
   */
  async setSubDepartments(memberId: string, subDepartmentIds: string[]): Promise<void> {
    const db = (await import("@repo/database")).getDb();

    const existing = await db
      .select({ subDepartmentId: subDepartmentMembers.subDepartmentId })
      .from(subDepartmentMembers)
      .where(eq(subDepartmentMembers.memberId, memberId));

    const existingIds = new Set(existing.map((e) => e.subDepartmentId));

    const toAdd = subDepartmentIds.filter((id) => !existingIds.has(id));
    const toRemove = [...existingIds].filter((id) => !subDepartmentIds.includes(id));

    if (toAdd.length > 0) {
      await db.insert(subDepartmentMembers).values(
        toAdd.map((subDepartmentId) => ({
          memberId,
          subDepartmentId,
          role: "Member",
          isPrimary: false,
        }))
      );
    }

    for (const subDepartmentId of toRemove) {
      await db
        .delete(subDepartmentMembers)
        .where(
          and(
            eq(subDepartmentMembers.memberId, memberId),
            eq(subDepartmentMembers.subDepartmentId, subDepartmentId)
          )
        );
    }

    void families; // reserved for future family assignment support
  }

  async setEmailVerified(id: string, verified: boolean): Promise<void> {
    const db = (await import("@repo/database")).getDb();
    await db
      .update(users)
      .set({ emailVerified: verified, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async countActiveExecutives(): Promise<number> {
    const db = (await import("@repo/database")).getDb();
    const result = await db
      .select({ value: count() })
      .from(users)
      .where(and(inArray(users.role, ["SUPER_ADMIN", "CHAIRPERSON"]), eq(users.status, "ACTIVE")));
    return result[0]?.value ?? 0;
  }

  async setStatus(
    id: string,
    status: "ACTIVE" | "DEACTIVATED",
    deactivatedAt: Date | null
  ): Promise<void> {
    const db = (await import("@repo/database")).getDb();
    await db
      .update(users)
      .set({ status, deactivatedAt, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async getMemberships(
    memberId: string
  ): Promise<Array<{ subDepartmentCode: string; subDepartmentId: string; role: string }>> {
    const db = (await import("@repo/database")).getDb();
    return db
      .select({
        subDepartmentCode: subDepartments.code,
        subDepartmentId: subDepartments.id,
        role: subDepartmentMembers.role,
      })
      .from(subDepartmentMembers)
      .innerJoin(subDepartments, eq(subDepartmentMembers.subDepartmentId, subDepartments.id))
      .where(eq(subDepartmentMembers.memberId, memberId));
  }

  async getSubDepartmentCodes(ids: string[]): Promise<Map<string, string>> {
    const db = (await import("@repo/database")).getDb();
    if (ids.length === 0) return new Map();
    const rows = await db
      .select({ id: subDepartments.id, code: subDepartments.code })
      .from(subDepartments)
      .where(inArray(subDepartments.id, ids));
    return new Map(rows.map((r) => [r.id, r.code]));
  }
}
