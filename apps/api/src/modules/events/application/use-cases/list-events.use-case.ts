import type { Event } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

export class ListEventsUseCase {
  constructor(private readonly repo: EventsRepository) {}

  async execute(params: {
    page?: number;
    limit?: number;
    eventType?: string;
  }): Promise<{
    success: boolean;
    data: Event[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.repo.findManyEvents(params);
  }
}
