import type { ProgramSession } from "@repo/domain";
import type { AttendanceRepository } from "../../domain/repositories/attendance.repository.js";

export class ListSessionsUseCase {
  constructor(private readonly repo: AttendanceRepository) {}

  async execute(params: {
    page?: number;
    limit?: number;
    sessionType?: string;
  }): Promise<{
    success: boolean;
    data: ProgramSession[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.repo.findManySessions(params);
  }
}
