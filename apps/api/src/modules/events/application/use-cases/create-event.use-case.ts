import type { Event, EventProgramAssignment } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

interface CreateEventInput {
  eventName: string;
  eventType: string;
  eventDate: string;
  isPublished?: boolean;
  countdownActive?: boolean;
}

export class CreateEventUseCase {
  constructor(private readonly repo: EventsRepository) {}

  async execute(input: CreateEventInput): Promise<Event> {
    const validTypes = ["Special", "Extra_Training", "Awdemerit", "Adar"];
    if (!validTypes.includes(input.eventType)) {
      throw new Error(
        `Invalid event type: ${input.eventType}. Must be one of: ${validTypes.join(", ")}`
      );
    }

    return this.repo.createEvent({
      eventName: input.eventName,
      eventType: input.eventType as Event["eventType"],
      eventDate: new Date(input.eventDate),
      isPublished: input.isPublished ?? false,
      countdownActive: input.countdownActive ?? false,
    });
  }
}
