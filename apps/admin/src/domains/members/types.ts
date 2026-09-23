import type { Gender } from "../shared/types";

export type YearOfStudy = "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "5th Year" | "GC";

export interface Member {
  id: string;
  fullName: string;
  christianName: string;
  phoneNumber: string;
  yearOfStudy: YearOfStudy;
  academicDepartment: string;
  campus: string;
  gender: Gender;
  photoUrl: string | null;
  telegramUsername: string | null;
  dateJoined: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  familyName: string;
  fatherMemberId: string | null;
  motherMemberId: string | null;
  academicYear: string;
  createdAt: string;
}

export interface MemberFilters {
  page?: number;
  limit?: number;
  search?: string;
  subDept?: string;
  familyId?: string;
  yearOfStudy?: string;
  isActive?: boolean;
}
