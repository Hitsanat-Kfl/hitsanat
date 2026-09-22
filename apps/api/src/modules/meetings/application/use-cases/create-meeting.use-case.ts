import { BusinessRuleViolationError, ValidationError } from "@repo/domain";
import type { MeetingsRepository } from "../../domain/repositories/meetings.repository.js";

export interface CreateMeetingInput {
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes?: number;
  location?: string;
  agenda?: string;
  createdBy: string;
  inviteeUserIds?: string[];
}

/** BR-019: recurring meetings cannot exceed 12 instances. */
export const MAX_RECURRING_INSTANCES = 12;

export class CreateMeetingUseCase {
  constructor(private readonly repo: MeetingsRepository) {}

  async execute(input: CreateMeetingInput) {
    if (!input.title?.trim()) {
      throw new ValidationError("Meeting title is required");
    }

    const scheduledAt = new Date(input.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new ValidationError("Invalid scheduledAt date");
    }

    // BR-019: meeting invitees must be active leadership members.
    const requestedIds = [...new Set(input.inviteeUserIds ?? [])];
    if (requestedIds.length > 0) {
      const validIds = await this.repo.findLeadershipUserIds(requestedIds);
      const invalid = requestedIds.filter((id) => !validIds.includes(id));
      if (invalid.length > 0) {
        throw new BusinessRuleViolationError(
          "BR-019: meeting invitees must be active leadership members (executive or sub-department leaders)"
        );
      }
    }

    const meeting = await this.repo.createMeeting({
      title: input.title.trim(),
      description: input.description,
      scheduledAt,
      durationMinutes: input.durationMinutes ?? 60,
      location: input.location,
      agenda: input.agenda,
      createdBy: input.createdBy,
      invitees: requestedIds.map((userId) => ({ userId })),
    });

    const invitees = await this.repo.findInviteesByMeetingId(meeting.id);
    return { ...meeting, invitees };
  }
}
