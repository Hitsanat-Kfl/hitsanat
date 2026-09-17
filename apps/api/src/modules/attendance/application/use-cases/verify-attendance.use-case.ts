import type { ProgramSessionAttendance } from "@repo/domain";

const AttendanceStatus = {
  EXPECTED: "Expected",
  PRESENT: "Present",
  ABSENT: "Absent",
  EXCUSED: "Excused",
} as const;
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
    if (!(validStatuses as readonly string[]).includes(status)) {
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
      if (!(validStatuses as readonly string[]).includes(record.status)) {
        throw new Error(
          `Invalid status: ${record.status}. Must be one of: ${validStatuses.join(", ")}`
        );
      }
    }

    return this.repo.batchUpdateAttendance(records);
  }
}
