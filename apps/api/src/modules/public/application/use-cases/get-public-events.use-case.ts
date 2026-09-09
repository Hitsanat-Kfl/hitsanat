import type { Event } from "@repo/domain";
import type { PublicRepository } from "../../domain/repositories/public.repository.js";

export class GetPublicEventsUseCase {
  constructor(private readonly repo: PublicRepository) {}

  async execute(): Promise<Event[]> {
    return this.repo.getPublishedEvents();
  }
}
