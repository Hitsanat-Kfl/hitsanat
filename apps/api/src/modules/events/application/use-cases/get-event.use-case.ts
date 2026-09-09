import type { Event, EventProgramAssignment } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

export class GetEventUseCase {
  constructor(private readonly repo: EventsRepository) {}

  async execute(id: string): Promise<Event & { programs: EventProgramAssignment[] }> {
    const event = await this.repo.findEventById(id);
    if (!event) {
      throw new Error(`Event not found: ${id}`);
    }
    return event;
  }
}
