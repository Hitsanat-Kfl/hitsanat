import type { CreateMeetingInvitee, Meeting, MeetingInvitee } from "@repo/domain";

export interface MeetingsRepository {
  findMeetingById(id: string): Promise<Meeting | null>;
  findManyMeetings(params: {
    page?: number;
    limit?: number;
    status?: string;
    upcomingOnly?: boolean;
  }): Promise<{
    success: boolean;
    data: Meeting[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  createMeeting(data: {
    title: string;
    description?: string;
    scheduledAt: Date;
    durationMinutes: number;
    location?: string;
    agenda?: string;
    createdBy: string;
    invitees: { userId: string; memberId?: string }[];
  }): Promise<Meeting>;
  updateMeeting(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      scheduledAt: Date;
      durationMinutes: number;
      location: string;
      agenda: string;
      status: string;
    }>
  ): Promise<Meeting>;
  cancelMeeting(id: string): Promise<Meeting>;
  recordMinutes(
    id: string,
    data: { minutes: string; recordedBy: string; recordedAt: Date }
  ): Promise<Meeting>;
  findInviteesByMeetingId(meetingId: string): Promise<MeetingInvitee[]>;
  replaceInvitees(meetingId: string, invitees: CreateMeetingInvitee[]): Promise<MeetingInvitee[]>;
  /** BR-019: count scheduled meetings still pending for this creator. */
  countScheduledMeetingsByCreator(createdBy: string): Promise<number>;
  /** BR-019: invitees must be active leadership members. */
  findLeadershipUserIds(userIds: string[]): Promise<string[]>;
}
