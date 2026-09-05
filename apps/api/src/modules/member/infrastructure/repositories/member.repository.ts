import { and, count, desc, eq, getDb, ilike, or } from "@repo/database";
import { familyMembers, members, subDepartmentMembers } from "@repo/database/schema";
import type {
  CreateEntity,
  Member,
  PaginatedResponse,
  PaginationParams,
  UpdateEntity,
} from "@repo/schemas";
import type { MemberRepository } from "../../domain/repositories/member.repository.js";

function toDomain(row: typeof members.$inferSelect): Member {
  return {
    id: row.id,
    fullName: row.fullName,
    christianName: row.christianName,
    phoneNumber: row.phoneNumber,
    yearOfStudy: row.yearOfStudy as Member["yearOfStudy"],
    academicDepartment: row.academicDepartment,
    campus: row.campus,
    gender: row.gender as Member["gender"],
    photoUrl: row.photoUrl ?? undefined,
    telegramUsername: row.telegramUsername ?? undefined,
    dateJoined: row.dateJoined,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DrizzleMemberRepository implements MemberRepository {
  async findById(id: string): Promise<Member | null> {
    const db = getDb();
    const rows = await db.select().from(members).where(eq(members.id, id)).limit(1);
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Member | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(members)
      .where(eq(members.phoneNumber, phoneNumber))
      .limit(1);
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async findMany(params: PaginationParams): Promise<PaginatedResponse<Member>> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const searchCondition = params.search
      ? or(
          ilike(members.fullName, `%${params.search}%`),
          ilike(members.christianName, `%${params.search}%`),
          ilike(members.phoneNumber, `%${params.search}%`)
        )
      : undefined;

    const whereClause = searchCondition ? and(searchCondition) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(members)
        .where(whereClause)
        .orderBy(desc(members.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(members).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toDomain),
      pagination: { page, limit, total, totalPages },
    };
  }

  async create(data: CreateEntity<Member>): Promise<Member> {
    const db = getDb();
    const rows = await db
      .insert(members)
      .values({
        fullName: data.fullName,
        christianName: data.christianName,
        phoneNumber: data.phoneNumber,
        yearOfStudy: data.yearOfStudy,
        academicDepartment: data.academicDepartment,
        campus: data.campus,
        gender: data.gender,
        photoUrl: data.photoUrl ?? null,
        telegramUsername: data.telegramUsername ?? null,
        dateJoined: data.dateJoined,
        isActive: data.isActive,
      })
      .returning();
    return toDomain(rows[0]);
  }

  async update(id: string, data: UpdateEntity<Member>): Promise<Member> {
    const db = getDb();
    const rows = await db
      .update(members)
      .set({
        ...data,
        photoUrl: data.photoUrl === undefined ? undefined : (data.photoUrl ?? null),
        telegramUsername:
          data.telegramUsername === undefined ? undefined : (data.telegramUsername ?? null),
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();
    if (rows.length === 0) {
      throw new Error(`Member with id ${id} not found`);
    }
    return toDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    const db = getDb();
    const rows = await db.delete(members).where(eq(members.id, id)).returning();
    if (rows.length === 0) {
      throw new Error(`Member with id ${id} not found`);
    }
  }

  async findBySubDepartment(subDepartmentId: string): Promise<Member[]> {
    const db = getDb();
    const rows = await db
      .select({ member: members })
      .from(subDepartmentMembers)
      .innerJoin(members, eq(subDepartmentMembers.memberId, members.id))
      .where(eq(subDepartmentMembers.subDepartmentId, subDepartmentId));
    return rows.map((r) => toDomain(r.member));
  }

  async findByFamily(familyId: string): Promise<Member[]> {
    const db = getDb();
    const rows = await db
      .select({ member: members })
      .from(familyMembers)
      .innerJoin(members, eq(familyMembers.memberId, members.id))
      .where(eq(familyMembers.familyId, familyId));
    return rows.map((r) => toDomain(r.member));
  }

  async findActive(): Promise<Member[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(members)
      .where(eq(members.isActive, true))
      .orderBy(desc(members.createdAt));
    return rows.map(toDomain);
  }

  async countActive(): Promise<number> {
    const db = getDb();
    const result = await db
      .select({ value: count() })
      .from(members)
      .where(eq(members.isActive, true));
    return result[0]?.value ?? 0;
  }
}
