import type { EventAttendance } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

interface RecordEventAttendanceInput {
  eventId: string;
  personType: string;
  personId: string;
  status: string;
  recordedBy: string;
}

export class RecordEventAttendanceUseCase {
  constructor(private readonly repo: EventsRepository) {}

  async execute(input: RecordEventAttendanceInput): Promise<EventAttendance> {
    const event = await this.repo.findEventById(input.eventId);
    if (!event) {
      throw new Error(`Event not found: ${input.eventId}`);
    }

    return this.repo.createEventAttendance({
      eventId: input.eventId,
      personType: input.personType,
      personId: input.personId,
      status: input.status,
      recordedBy: input.recordedBy,
    });
  }
}
