import type { Event } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

/**
 * ApproveEventUseCase (endpoints.md §2.5): Chairperson or Sub-Chairperson
 * (ADR-0018) approves the event and toggles the publish flag, which triggers
 * the live website countdown and Telegram broadcast (workflows §6).
 */
export class ApproveEventUseCase {
  constructor(private readonly repo: EventsRepository) {}

  async execute(input: {
    id: string;
    approvedBy: string;
    publish: boolean;
  }): Promise<Event> {
    const existing = await this.repo.findEventById(input.id);
    if (!existing) {
      throw new Error(`Event not found: ${input.id}`);
    }

    return this.repo.updateEvent(input.id, {
      isPublished: input.publish,
      countdownActive: input.publish,
    });
  }
}
