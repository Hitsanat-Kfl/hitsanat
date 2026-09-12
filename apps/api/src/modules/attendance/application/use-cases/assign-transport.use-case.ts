import type { ProgramSessionAttendance } from "@repo/domain";
import { AttendanceStatus, PersonType } from "@repo/domain";
import type { AttendanceRepository } from "../../domain/repositories/attendance.repository.js";

const COLLECTION_LOCATIONS = ["Apartama", "Gende Boy", "Gende Je", "Cobalt", "Bate"] as const;
const MIN_MEMBERS_PER_ROUTE = 2;

interface TransportAssignmentInput {
  sessionId: string;
  assignments: {
    memberId: string;
    collectionLocation: string;
  }[];
  assignedBy: string;
}

export class AssignTransportUseCase {
  constructor(private readonly repo: AttendanceRepository) {}

  async execute(input: TransportAssignmentInput): Promise<ProgramSessionAttendance[]> {
    const session = await this.repo.findSessionById(input.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${input.sessionId}`);
    }

    for (const assignment of input.assignments) {
      if (
        !COLLECTION_LOCATIONS.includes(
          assignment.collectionLocation as (typeof COLLECTION_LOCATIONS)[number]
        )
      ) {
        throw new Error(`Invalid collection location: ${assignment.collectionLocation}`);
      }
    }

    const locationCounts = new Map<string, number>();
    for (const assignment of input.assignments) {
      const current = locationCounts.get(assignment.collectionLocation) ?? 0;
      locationCounts.set(assignment.collectionLocation, current + 1);
    }

    for (const [location, memberCount] of locationCounts) {
      if (memberCount < MIN_MEMBERS_PER_ROUTE) {
        throw new Error(
          `Location "${location}" has ${memberCount} members. Minimum ${MIN_MEMBERS_PER_ROUTE} required per route (BR-014).`
        );
      }
    }

    const records = input.assignments.map((a) => ({
      programSessionId: input.sessionId,
      personType: PersonType.MEMBER,
      personId: a.memberId,
      collectionLocation: a.collectionLocation,
      status: AttendanceStatus.EXPECTED,
      recordedBy: input.assignedBy,
    }));

    return this.repo.createAttendanceRecords(records);
  }
}
