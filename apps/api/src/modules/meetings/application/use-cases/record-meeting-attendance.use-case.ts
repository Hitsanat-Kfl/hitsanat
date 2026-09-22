import { InviteeResponseStatus, MeetingStatus } from "@repo/domain";
import type { CreateMeetingInvitee, MeetingInvitee } from "@repo/domain";
import type { MeetingsRepository } from "../../domain/repositories/meetings.repository.js";

const VALID_STATUSES: string[] = [
  InviteeResponseStatus.ATTENDED,
  InviteeResponseStatus.ABSENT,
  InviteeResponseStatus.ACCEPTED,
  InviteeResponseStatus.DECLINED,
];

export interface AttendanceEntry {
  userId: string;
  status: string;
}

/**
 * POST /meetings/:id/attendance (endpoints.md §2.9).
 * Marks attendance for meeting invitees. Invitees must exist on the meeting;
 * unknown userIds are rejected. BR-019 trio is enforced at the router level.
 */
export class RecordMeetingAttendanceUseCase {
  constructor(private readonly repo: MeetingsRepository) {}

  async execute(input: {
    meetingId: string;
    markedBy: string;
    entries: AttendanceEntry[];
  }): Promise<{ meetingId: string; markedBy: string; updated: MeetingInvitee[] }> {
    if (!input.meetingId) {
      throw new Error("meetingId is required");
    }
    if (input.entries.length === 0) {
      throw new Error("attendance entries are required");
    }

    const meeting = await this.repo.findMeetingById(input.meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${input.meetingId}`);
    }
    if (meeting.status === MeetingStatus.CANCELLED) {
      throw new Error("Cannot record attendance for a cancelled meeting");
    }

    const seen = new Set<string>();
    for (const entry of input.entries) {
      if (!entry.userId) {
        throw new Error("each attendance entry requires userId");
      }
      if (!VALID_STATUSES.includes(entry.status)) {
        throw new Error(
          `Invalid attendance status: ${entry.status}. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }
      if (seen.has(entry.userId)) {
        throw new Error(`duplicate attendance entry for user ${entry.userId}`);
      }
      seen.add(entry.userId);
    }

    const invitees = await this.repo.findInviteesByMeetingId(input.meetingId);
    const inviteeByUser = new Map(invitees.map((i) => [i.userId, i]));
    const unknown = [...seen].filter((userId) => !inviteeByUser.has(userId));
    if (unknown.length > 0) {
      throw new Error(
        `the following users are not invitees of this meeting: ${unknown.join(", ")}`
      );
    }

    // Replace invitee rows wholesale (existing replaceInvitees semantics),
    // preserving responses for invitees not present in this batch.
    const updatedInvitees: CreateMeetingInvitee[] = invitees.map((invitee) => {
      const entry = input.entries.find((e) => e.userId === invitee.userId);
      return {
        meetingId: invitee.meetingId,
        userId: invitee.userId,
        memberId: invitee.memberId,
        responseStatus: entry ? (entry.status as InviteeResponseStatus) : invitee.responseStatus,
      };
    });
    await this.repo.replaceInvitees(input.meetingId, updatedInvitees);

    const updated = await this.repo.findInviteesByMeetingId(input.meetingId);
    return { meetingId: input.meetingId, markedBy: input.markedBy, updated };
  }
}
