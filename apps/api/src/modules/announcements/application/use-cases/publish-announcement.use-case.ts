import type { Announcement } from "@repo/domain";
import type { AnnouncementsRepository } from "../../domain/repositories/announcements.repository.js";

export class PublishAnnouncementUseCase {
  constructor(private readonly repo: AnnouncementsRepository) {}

  async execute(id: string): Promise<Announcement> {
    const announcement = await this.repo.findAnnouncementById(id);
    if (!announcement) {
      throw new Error(`Announcement not found: ${id}`);
    }

    if (announcement.isPublished) {
      throw new Error("Announcement is already published");
    }

    return this.repo.publishAnnouncement(id);
  }
}
