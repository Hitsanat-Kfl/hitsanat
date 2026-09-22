import { BusinessRuleViolationError, InviteeResponseStatus, ValidationError } from "@repo/domain";
import type { MeetingsRepository } from "../../domain/repositories/meetings.repository.js";

const VALID_STATUSES = ["Scheduled", "Completed", "Cancelled"];

export class UpdateMeetingUseCase {
  constructor(private readonly repo: MeetingsRepository) {}

  async execute(
    id: string,
    input: {
      title?: string;
      description?: string;
      scheduledAt?: string;
      durationMinutes?: number;
      location?: string;
      agenda?: string;
      status?: string;
      inviteeUserIds?: string[];
    }
  ) {
    const existing = await this.repo.findMeetingById(id);
    if (!existing) {
      throw new ValidationError(`Meeting not found: ${id}`);
    }
    if (existing.status === "Cancelled") {
      throw new BusinessRuleViolationError("BR-019: cannot modify a cancelled meeting");
    }
    if (input.status && !VALID_STATUSES.includes(input.status)) {
      throw new ValidationError(`Invalid status: ${input.status}`);
    }

    if (input.inviteeUserIds) {
      const requestedIds = [...new Set(input.inviteeUserIds)];
      if (requestedIds.length > 0) {
        const validIds = await this.repo.findLeadershipUserIds(requestedIds);
        const invalid = requestedIds.filter((r) => !validIds.includes(r));
        if (invalid.length > 0) {
          throw new BusinessRuleViolationError(
            "BR-019: meeting invitees must be active leadership members (executive or sub-department leaders)"
          );
        }
      }
      await this.repo.replaceInvitees(
        id,
        requestedIds.map((userId) => ({
          meetingId: id,
          userId,
          responseStatus: InviteeResponseStatus.PENDING,
        }))
      );
    }

    const meeting = await this.repo.updateMeeting(id, {
      title: input.title,
      description: input.description,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      durationMinutes: input.durationMinutes,
      location: input.location,
      agenda: input.agenda,
      status: input.status,
    });

    const invitees = await this.repo.findInviteesByMeetingId(id);
    return { ...meeting, invitees };
  }
}

export class CancelMeetingUseCase {
  constructor(private readonly repo: MeetingsRepository) {}

  async execute(id: string) {
    const existing = await this.repo.findMeetingById(id);
    if (!existing) {
      throw new ValidationError(`Meeting not found: ${id}`);
    }
    if (existing.status === "Completed") {
      throw new BusinessRuleViolationError(
        "BR-019: cannot cancel a completed meeting — record minutes instead"
      );
    }
    return this.repo.cancelMeeting(id);
  }
}

export class RecordMinutesUseCase {
  constructor(private readonly repo: MeetingsRepository) {}

  async execute(id: string, input: { minutes: string; recordedBy: string }) {
    if (!input.minutes?.trim()) {
      throw new ValidationError("Meeting minutes are required");
    }
    const existing = await this.repo.findMeetingById(id);
    if (!existing) {
      throw new ValidationError(`Meeting not found: ${id}`);
    }
    if (existing.status === "Cancelled") {
      throw new BusinessRuleViolationError("BR-019: cannot record minutes for a cancelled meeting");
    }
    return this.repo.recordMinutes(id, {
      minutes: input.minutes.trim(),
      recordedBy: input.recordedBy,
      recordedAt: new Date(),
    });
  }
}
