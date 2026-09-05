import type { BaseEntity } from "../base.js";

export enum MemberStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  GRADUATED = "Graduated",
  ARCHIVED = "Archived",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum YearOfStudy {
  FIRST = "1st Year",
  SECOND = "2nd Year",
  THIRD = "3rd Year",
  FOURTH = "4th Year",
  FIFTH = "5th Year",
  GC = "GC",
}

export interface Member extends BaseEntity {
  fullName: string;
  christianName: string;
  phoneNumber: string;
  yearOfStudy: YearOfStudy;
  academicDepartment: string;
  campus: string;
  gender: Gender;
  photoUrl: string | null;
  telegramUsername: string | null;
  dateJoined: Date;
  isActive: boolean;
}

export interface SubDepartment extends BaseEntity {
  code: string;
  nameAm: string;
  nameEn: string;
  description?: string;
}

export interface SubDepartmentMember extends BaseEntity {
  memberId: string;
  subDepartmentId: string;
  role: SubDeptRole;
  isPrimary: boolean;
  assignedAt: Date;
}

export enum SubDeptRole {
  LEADER = "Leader",
  SUB_LEADER = "Sub-Leader",
  SECRETARY = "Secretary",
  MEMBER = "Member",
}

export type CreateMember = Omit<Member, "id" | "createdAt" | "updatedAt">;
export type UpdateMember = Partial<Omit<Member, "id" | "createdAt" | "updatedAt">>;
