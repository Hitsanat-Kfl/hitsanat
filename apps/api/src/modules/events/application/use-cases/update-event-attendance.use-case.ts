import type { EventAttendance } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

interface UpdateEventAttendanceInput {
  id: string;
  status?: string;
  confirmedAt?: Date;
}

export class UpdateEventAttendanceUseCase {
  constructor(private readonly repo: EventsRepository) {}

  async execute(input: UpdateEventAttendanceInput): Promise<EventAttendance> {
    const existing = await this.repo.findEventAttendanceById(input.id);
    if (!existing) {
      throw new Error(`Event attendance not found: ${input.id}`);
    }

    return this.repo.updateEventAttendance(input.id, {
      status: input.status,
      confirmedAt: input.confirmedAt,
    });
  }
}
