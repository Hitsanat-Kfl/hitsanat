export type SubDeptCode = "TIMIHRT" | "MEZMUR" | "KUTITR" | "EKD" | "KINETIBEB";

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

export interface SubDeptDashboard {
  departmentCode: string;
  departmentName: string;
  memberCount: number;
  childCount: number;
  attendanceRate: number;
  recentEvents: import("../communications/types").PublicEvent[];
  progressItems: import("../planning/types").ProgressSummaryItem[];
}
