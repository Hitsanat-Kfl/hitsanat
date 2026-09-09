import type { BaseEntity } from "@repo/domain";

export interface Family extends BaseEntity {
  familyName: string;
  fatherMemberId: string | null;
  motherMemberId: string | null;
  academicYear: string;
}

export interface FamilyMember extends BaseEntity {
  familyId: string;
  memberId: string;
  assignedAt: Date;
}

export type CreateFamily = Omit<Family, "id" | "createdAt">;
export type UpdateFamily = Partial<Omit<Family, "id" | "createdAt">>;
