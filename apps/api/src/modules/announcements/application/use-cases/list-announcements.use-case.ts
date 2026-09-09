import type { Announcement } from "@repo/domain";
import type { AnnouncementsRepository } from "../../domain/repositories/announcements.repository.js";

export class ListAnnouncementsUseCase {
  constructor(private readonly repo: AnnouncementsRepository) {}

  async execute(params: {
    page?: number;
    limit?: number;
    targetAudience?: string;
    isPublished?: boolean;
  }): Promise<{
    success: boolean;
    data: Announcement[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.repo.findManyAnnouncements(params);
  }
}
