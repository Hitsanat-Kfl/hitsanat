import type { ProgramSession, ProgramSessionAttendance } from "@repo/domain";

export interface AttendanceRepository {
  findSessionById(id: string): Promise<ProgramSession | null>;
  findManySessions(params: { page?: number; limit?: number; sessionType?: string }): Promise<{
    success: boolean;
    data: ProgramSession[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  createSession(data: {
    sessionType: string;
    sessionDate: string;
    startTime: Date;
    endTime: Date;
  }): Promise<ProgramSession>;
  findAttendanceBySessionId(sessionId: string): Promise<ProgramSessionAttendance[]>;
  createAttendanceRecords(
    data: {
      programSessionId: string;
      personType: string;
      personId: string;
      collectionLocation?: string | null;
      status: string;
      recordedBy: string;
    }[]
  ): Promise<ProgramSessionAttendance[]>;
  updateAttendanceRecord(
    id: string,
    data: {
      status: string;
      recordedBy: string;
      confirmedAt: Date;
    }
  ): Promise<ProgramSessionAttendance>;
  batchUpdateAttendance(
    records: {
      id: string;
      status: string;
      recordedBy: string;
    }[]
  ): Promise<ProgramSessionAttendance[]>;
  findActiveMembers(): Promise<{ id: string }[]>;
  findActiveChildren(): Promise<{ id: string; collectionLocation: string | null }[]>;
}
