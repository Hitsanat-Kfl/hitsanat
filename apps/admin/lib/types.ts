export type YearOfStudy = "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "5th Year" | "GC";
export type Gender = "Male" | "Female";
export type SubDeptCode = "TIMIHRT" | "MEZMUR" | "KUTITR" | "EKD" | "KINETIBEB";

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

export interface SubDepartment {
  id: string;
  code: SubDeptCode;
  nameAm: string;
  nameEn: string;
  description: string | null;
  createdAt: string;
}

export interface SubDepartmentMember {
  memberId: string;
  memberName: string;
  christianName: string;
  role: string;
  isPrimary: boolean;
  assignedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
