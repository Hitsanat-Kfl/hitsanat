import type { Announcement } from "@repo/domain";
import type { AnnouncementsRepository } from "../../domain/repositories/announcements.repository.js";

const VALID_AUDIENCES = ["Public", "Members", "Parents"] as const;

interface CreateAnnouncementInput {
  title: string;
  content: string;
  targetAudience: string;
  createdBy: string;
}

export class CreateAnnouncementUseCase {
  constructor(private readonly repo: AnnouncementsRepository) {}

  async execute(input: CreateAnnouncementInput): Promise<Announcement> {
    if (!(VALID_AUDIENCES as readonly string[]).includes(input.targetAudience)) {
      throw new Error(
        `Invalid target audience: ${input.targetAudience}. Must be one of: ${VALID_AUDIENCES.join(", ")}`
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
