import type { ProgramSessionAttendance } from "@repo/domain";
import { AttendanceStatus } from "@repo/domain";
import type { AttendanceRepository } from "../../domain/repositories/attendance.repository.js";

export class VerifyAttendanceUseCase {
  constructor(private readonly repo: AttendanceRepository) {}

  async executeSingle(
    recordId: string,
    status: string,
    recordedBy: string
  ): Promise<ProgramSessionAttendance> {
    const validStatuses = [
      AttendanceStatus.PRESENT,
      AttendanceStatus.ABSENT,
      AttendanceStatus.EXCUSED,
    ];
    if (!validStatuses.includes(status as AttendanceStatus)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(", ")}`);
    }

    return this.repo.updateAttendanceRecord(recordId, {
      status,
      recordedBy,
      confirmedAt: new Date(),
    });
  }

  async executeBatch(
    records: { id: string; status: string; recordedBy: string }[]
  ): Promise<ProgramSessionAttendance[]> {
    const validStatuses = [
      AttendanceStatus.PRESENT,
      AttendanceStatus.ABSENT,
      AttendanceStatus.EXCUSED,
    ];
    for (const record of records) {
      if (!validStatuses.includes(record.status as AttendanceStatus)) {
        throw new Error(
          `Invalid status: ${record.status}. Must be one of: ${validStatuses.join(", ")}`
        );
      }
    }

    return this.repo.batchUpdateAttendance(records);
  }
}
