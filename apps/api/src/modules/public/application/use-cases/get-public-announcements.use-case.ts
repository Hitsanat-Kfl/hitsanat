import type { Announcement } from "@repo/domain";
import type { PublicRepository } from "../../domain/repositories/public.repository.js";

export class GetPublicAnnouncementsUseCase {
  constructor(private readonly repo: PublicRepository) {}

  async execute(): Promise<Announcement[]> {
    return this.repo.getPublishedAnnouncements();
  }
}
