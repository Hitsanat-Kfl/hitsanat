import type { Announcement } from "@repo/domain";
import { TargetAudience } from "@repo/domain";
import type { AnnouncementsRepository } from "../../domain/repositories/announcements.repository.js";

interface CreateAnnouncementInput {
  title: string;
  content: string;
  targetAudience: string;
  createdBy: string;
}

export class CreateAnnouncementUseCase {
  constructor(private readonly repo: AnnouncementsRepository) {}

  async execute(input: CreateAnnouncementInput): Promise<Announcement> {
    const validAudiences = Object.values(TargetAudience);
    if (!validAudiences.includes(input.targetAudience as TargetAudience)) {
      throw new Error(
        `Invalid target audience: ${input.targetAudience}. Must be one of: ${validAudiences.join(", ")}`
      );
    }

    return this.repo.createAnnouncement({
      title: input.title,
      content: input.content,
      targetAudience: input.targetAudience,
      createdBy: input.createdBy,
    });
  }
}
