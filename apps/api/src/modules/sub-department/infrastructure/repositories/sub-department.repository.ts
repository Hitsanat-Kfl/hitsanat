import { eq, getDb } from "@repo/database";
import { members, subDepartmentMembers, subDepartments } from "@repo/database/schema";
import type {
  SubDepartment,
  SubDepartmentMember,
} from "../../domain/entities/sub-department.entity.js";
import type { SubDepartmentRepository } from "../../domain/repositories/sub-department.repository.js";

function toDomain(row: typeof subDepartments.$inferSelect): SubDepartment {
  return {
    id: row.id,
    code: row.code,
    nameAm: row.nameAm,
    nameEn: row.nameEn,
    description: row.description,
    createdAt: row.createdAt,
  };
}

export class DrizzleSubDepartmentRepository implements SubDepartmentRepository {
  async findAll(): Promise<SubDepartment[]> {
    const db = getDb();
    const rows = await db.select().from(subDepartments);
    return rows.map(toDomain);
  }

  async findByCode(code: string): Promise<SubDepartment | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(subDepartments)
      .where(eq(subDepartments.code, code))
      .limit(1);
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async findRoster(subDepartmentId: string): Promise<SubDepartmentMember[]> {
    const db = getDb();
    const rows = await db
      .select({
        memberId: subDepartmentMembers.memberId,
        memberName: members.fullName,
        christianName: members.christianName,
        role: subDepartmentMembers.role,
        isPrimary: subDepartmentMembers.isPrimary,
        assignedAt: subDepartmentMembers.assignedAt,
      })
      .from(subDepartmentMembers)
      .innerJoin(members, eq(subDepartmentMembers.memberId, members.id))
      .where(eq(subDepartmentMembers.subDepartmentId, subDepartmentId));

    return rows.map((row) => ({
      memberId: row.memberId,
      memberName: row.memberName,
      christianName: row.christianName,
      role: row.role,
      isPrimary: row.isPrimary,
      assignedAt: row.assignedAt,
    }));
  }
}
