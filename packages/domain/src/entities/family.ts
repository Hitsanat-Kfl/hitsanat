import type { BaseEntity } from "../base.js";

export interface Family extends BaseEntity {
  familyName: string;
  fatherMemberId?: string;
  motherMemberId?: string;
  academicYear: string;
}

export interface FamilyMember extends BaseEntity {
  familyId: string;
  memberId: string;
  assignedAt: Date;
}

export type CreateFamily = Omit<Family, "id" | "createdAt">;
export type UpdateFamily = Partial<Omit<Family, "id" | "createdAt">>;
