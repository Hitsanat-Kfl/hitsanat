import type { z } from "zod";
import { memberStage1Schema, memberStage2Schema } from "@repo/schemas";

/**
 * Create Member Stage 1 DTO
 * Used for fast initial member creation
 */
export type CreateMemberStage1Dto = z.infer<typeof memberStage1Schema>;
export const createMemberStage1Dto = memberStage1Schema;

/**
 * Update Member Stage 2 DTO
 * Used for enriching member profile
 */
export type UpdateMemberStage2Dto = z.infer<typeof memberStage2Schema>;
export const updateMemberStage2Dto = memberStage2Schema;

/**
 * Member response DTO
 * Used for returning member data to clients
 */
export interface MemberResponseDto {
  id: string;
  fullName: string;
  christianName: string;
  phoneNumber: string;
  yearOfStudy: string;
  academicDepartment: string;
  campus: string;
  gender: string;
  photoUrl: string | null;
  telegramUsername: string | null;
  dateJoined: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transform a Member entity to a response DTO
 */
export function toMemberResponseDto(member: MemberResponseDto): MemberResponseDto {
  return {
    id: member.id,
    fullName: member.fullName,
    christianName: member.christianName,
    phoneNumber: member.phoneNumber,
    yearOfStudy: member.yearOfStudy,
    academicDepartment: member.academicDepartment,
    campus: member.campus,
    gender: member.gender,
    photoUrl: member.photoUrl,
    telegramUsername: member.telegramUsername,
    dateJoined: member.dateJoined instanceof Date ? member.dateJoined.toISOString() : member.dateJoined,
    isActive: member.isActive,
    createdAt: member.createdAt instanceof Date ? member.createdAt.toISOString() : member.createdAt,
    updatedAt: member.updatedAt instanceof Date ? member.updatedAt.toISOString() : member.updatedAt,
  };
}