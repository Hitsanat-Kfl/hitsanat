import { and, count, desc, eq, gte, inArray } from "@repo/database";
import { getDb } from "@repo/database";
import { meetingInvitees, meetings, subDepartmentMembers, users } from "@repo/database/schema";
import type { CreateMeetingInvitee, Meeting, MeetingInvitee } from "@repo/domain";
import { type InviteeResponseStatus, MeetingStatus } from "@repo/domain";
import type { MeetingsRepository } from "../../domain/repositories/meetings.repository.js";

function toMeeting(row: typeof meetings.$inferSelect): Meeting {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    scheduledAt: new Date(row.scheduledAt),
    durationMinutes: row.durationMinutes,
    location: row.location ?? undefined,
    agenda: row.agenda ?? undefined,
    status: row.status as MeetingStatus,
    minutes: row.minutes ?? undefined,
    minutesRecordedBy: row.minutesRecordedBy ?? undefined,
    minutesRecordedAt: row.minutesRecordedAt ? new Date(row.minutesRecordedAt) : undefined,
    createdBy: row.createdBy,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function toInvitee(row: typeof meetingInvitees.$inferSelect): MeetingInvitee {
  return {
    id: row.id,
    meetingId: row.meetingId,
    userId: row.userId,
    memberId: row.memberId ?? undefined,
    responseStatus: row.responseStatus as InviteeResponseStatus,
    createdAt: new Date(row.createdAt),
  };
}

export class DrizzleMeetingsRepository implements MeetingsRepository {
  async findMeetingById(id: string): Promise<Meeting | null> {
    const db = getDb();
    const rows = await db.select().from(meetings).where(eq(meetings.id, id)).limit(1);
    return rows.length > 0 ? toMeeting(rows[0]) : null;
  }

  async findManyMeetings(params: {
    page?: number;
    limit?: number;
    status?: string;
    upcomingOnly?: boolean;
  }): Promise<{
    success: boolean;
    data: Meeting[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const filters = [];
    if (params.status) filters.push(eq(meetings.status, params.status));
    if (params.upcomingOnly) {
      filters.push(gte(meetings.scheduledAt, new Date()));
      filters.push(eq(meetings.status, MeetingStatus.SCHEDULED));
    }
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(meetings)
        .where(whereClause)
        .orderBy(desc(meetings.scheduledAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(meetings).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    return {
      success: true,
      data: data.map(toMeeting),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createMeeting(data: {
    title: string;
    description?: string;
    scheduledAt: Date;
    durationMinutes: number;
    location?: string;
    agenda?: string;
    createdBy: string;
    invitees: { userId: string; memberId?: string }[];
  }): Promise<Meeting> {
    const db = getDb();
    const [row] = await db
      .insert(meetings)
      .values({
        title: data.title,
        description: data.description,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
        location: data.location,
        agenda: data.agenda,
        createdBy: data.createdBy,
      })
      .returning();

    if (data.invitees.length > 0) {
      await db.insert(meetingInvitees).values(
        data.invitees.map((invitee) => ({
          meetingId: row.id,
          userId: invitee.userId,
          memberId: invitee.memberId,
        }))
      );
    }

    return toMeeting(row);
  }

  async updateMeeting(
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
  ): Promise<Meeting> {
    const db = getDb();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.scheduledAt !== undefined) updateData.scheduledAt = data.scheduledAt;
    if (data.durationMinutes !== undefined) updateData.durationMinutes = data.durationMinutes;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.agenda !== undefined) updateData.agenda = data.agenda;
    if (data.status !== undefined) updateData.status = data.status;

    const [row] = await db.update(meetings).set(updateData).where(eq(meetings.id, id)).returning();
    return toMeeting(row);
  }

  async cancelMeeting(id: string): Promise<Meeting> {
    const db = getDb();
    const [row] = await db
      .update(meetings)
      .set({ status: MeetingStatus.CANCELLED, updatedAt: new Date() })
      .where(eq(meetings.id, id))
      .returning();
    return toMeeting(row);
  }

  async recordMinutes(
    id: string,
    data: { minutes: string; recordedBy: string; recordedAt: Date }
  ): Promise<Meeting> {
    const db = getDb();
    const [row] = await db
      .update(meetings)
      .set({
        minutes: data.minutes,
        minutesRecordedBy: data.recordedBy,
        minutesRecordedAt: data.recordedAt,
        status: MeetingStatus.COMPLETED,
        updatedAt: new Date(),
      })
      .where(eq(meetings.id, id))
      .returning();
    return toMeeting(row);
  }

  async findInviteesByMeetingId(meetingId: string): Promise<MeetingInvitee[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(meetingInvitees)
      .where(eq(meetingInvitees.meetingId, meetingId));
    return rows.map(toInvitee);
  }

  async replaceInvitees(
    meetingId: string,
    invitees: CreateMeetingInvitee[]
  ): Promise<MeetingInvitee[]> {
    const db = getDb();
    await db.delete(meetingInvitees).where(eq(meetingInvitees.meetingId, meetingId));
    if (invitees.length === 0) return [];
    const rows = await db
      .insert(meetingInvitees)
      .values(
        invitees.map((invitee) => ({
          meetingId,
          userId: invitee.userId,
          memberId: invitee.memberId,
          responseStatus: invitee.responseStatus,
        }))
      )
      .returning();
    return rows.map(toInvitee);
  }

  async countScheduledMeetingsByCreator(createdBy: string): Promise<number> {
    const db = getDb();
    const result = await db
      .select({ value: count() })
      .from(meetings)
      .where(and(eq(meetings.createdBy, createdBy), eq(meetings.status, MeetingStatus.SCHEDULED)));
    return result[0]?.value ?? 0;
  }

  /**
   * BR-019: invitees must be active leadership members — executive roles
   * (users.role) or sub-department leaders (sub_department_members.role).
   */
  async findLeadershipUserIds(userIds: string[]): Promise<string[]> {
    if (userIds.length === 0) return [];
    const db = getDb();

    const executiveRows = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          inArray(users.id, userIds),
          eq(users.status, "ACTIVE"),
          inArray(users.role, ["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"])
        )
      );

    const leaderSubDeptRows = await db
      .select({ id: subDepartmentMembers.memberId })
      .from(subDepartmentMembers)
      .innerJoin(users, eq(users.memberId, subDepartmentMembers.memberId))
      .where(
        and(
          inArray(users.id, userIds),
          eq(users.status, "ACTIVE"),
          inArray(subDepartmentMembers.role, ["Leader", "Sub-Leader"])
        )
      );

    const valid = new Set<string>([
      ...executiveRows.map((r) => r.id),
      ...leaderSubDeptRows.map((r) => r.id).filter((id): id is string => id !== null),
    ]);
    return userIds.filter((id) => valid.has(id));
  }
}
