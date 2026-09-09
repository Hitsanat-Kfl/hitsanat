import type { ProgramSessionAttendance } from "@repo/domain";
import { PersonType, AttendanceStatus } from "@repo/domain";
import type { AttendanceRepository } from "../../domain/repositories/attendance.repository.js";

export class SeedAttendanceUseCase {
  constructor(private readonly repo: AttendanceRepository) {}

  async execute(sessionId: string, recordedBy: string): Promise<ProgramSessionAttendance[]> {
    const session = await this.repo.findSessionById(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const existingRecords = await this.repo.findAttendanceBySessionId(sessionId);
    const existingPersonIds = new Set(existingRecords.map((r) => r.personId));

    const [activeMembers, activeChildren] = await Promise.all([
      this.repo.findActiveMembers(),
      this.repo.findActiveChildren(),
    ]);

    const newRecords: {
      programSessionId: string;
      personType: string;
      personId: string;
      collectionLocation?: string | null;
      status: string;
      recordedBy: string;
    }[] = [];

    for (const member of activeMembers) {
      if (!existingPersonIds.has(member.id)) {
        newRecords.push({
          programSessionId: sessionId,
          personType: PersonType.MEMBER,
          personId: member.id,
          status: AttendanceStatus.EXPECTED,
          recordedBy,
        });
      }
    }

    for (const child of activeChildren) {
      if (!existingPersonIds.has(child.id)) {
        newRecords.push({
          programSessionId: sessionId,
          personType: PersonType.CHILD,
          personId: child.id,
          collectionLocation: child.collectionLocation,
          status: AttendanceStatus.EXPECTED,
          recordedBy,
        });
      }
    }

    if (newRecords.length === 0) {
      return existingRecords;
    }

    const created = await this.repo.createAttendanceRecords(newRecords);
    return [...existingRecords, ...created];
  }
}
