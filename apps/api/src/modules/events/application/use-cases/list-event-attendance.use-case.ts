import type { EventAttendance } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

export class ListEventAttendanceUseCase {
  constructor(private readonly repo: EventsRepository) {}

  async execute(eventId: string): Promise<EventAttendance[]> {
    return this.repo.findEventAttendanceByEventId(eventId);
  }
}
