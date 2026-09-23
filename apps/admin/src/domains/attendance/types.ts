export type AttendanceStatus = "Present" | "Absent" | "Excused" | "Late";
export type SessionStatus = "Scheduled" | "In_Progress" | "Completed" | "Cancelled";

export interface AttendanceSession {
  id: string;
  sessionDate: string;
  subDepartmentId: string;
  sessionType: string;
  topic: string;
  status: SessionStatus;
  createdBy: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  status: AttendanceStatus;
  notes: string | null;
  transportAssigned: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

export interface AttendanceFilters {
  page?: number;
  limit?: number;
  subDepartmentId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
