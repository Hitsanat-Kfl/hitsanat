import type { ProgramSession } from "@repo/domain";
import { SessionType } from "@repo/domain";
import type { AttendanceRepository } from "../../domain/repositories/attendance.repository.js";

interface CreateSessionInput {
  sessionType: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
}

export class CreateSessionUseCase {
  constructor(private readonly repo: AttendanceRepository) {}

  async execute(input: CreateSessionInput): Promise<ProgramSession> {
    const validTypes = Object.values(SessionType);
    if (!validTypes.includes(input.sessionType as SessionType)) {
      throw new Error(
        `Invalid session type: ${input.sessionType}. Must be one of: ${validTypes.join(", ")}`
      );
    }

    return this.repo.createSession({
      sessionType: input.sessionType,
      sessionDate: input.sessionDate,
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
    });
  }
}
