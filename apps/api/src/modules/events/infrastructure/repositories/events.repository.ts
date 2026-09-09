import { count, desc, eq, getDb } from "@repo/database";
import { events, eventProgramAssignments } from "@repo/database/schema";
import type { Event, EventProgramAssignment } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

function toEvent(row: typeof events.$inferSelect): Event {
  return {
    id: row.id,
    eventName: row.eventName,
    eventType: row.eventType as Event["eventType"],
    eventDate: row.eventDate,
    isPublished: row.isPublished,
    countdownActive: row.countdownActive,
    createdAt: new Date(),
  };
}

function toProgramAssignment(
  row: typeof eventProgramAssignments.$inferSelect
): EventProgramAssignment {
  return {
    id: row.id,
    eventId: row.eventId,
    subDepartmentId: row.subDepartmentId,
    programTitle: row.programTitle,
    assignedMembers: row.assignedMembers ? JSON.parse(row.assignedMembers) : [],
    createdAt: new Date(),
  };
}

export class DrizzleEventsRepository implements EventsRepository {
  async findEventById(
    id: string
  ): Promise<(Event & { programs: EventProgramAssignment[] }) | null> {
    const db = getDb();
    const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
    if (rows.length === 0) return null;

    const event = toEvent(rows[0]);
    const programs = await this.findProgramAssignmentsByEventId(id);
    return { ...event, programs };
  }

  async findManyEvents(params: {
    page?: number;
    limit?: number;
    eventType?: string;
  }): Promise<{
    success: boolean;
    data: Event[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const whereClause = params.eventType ? eq(events.eventType, params.eventType) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(events)
        .where(whereClause)
        .orderBy(desc(events.eventDate))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(events).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toEvent),
      pagination: { page, limit, total, totalPages },
    };
  }

  async createEvent(data: {
    eventName: string;
    eventType: string;
    eventDate: Date;
    isPublished: boolean;
    countdownActive: boolean;
  }): Promise<Event> {
    const db = getDb();
    const rows = await db
      .insert(events)
      .values({
        eventName: data.eventName,
        eventType: data.eventType,
        eventDate: data.eventDate,
        isPublished: data.isPublished,
        countdownActive: data.countdownActive,
      })
      .returning();
    return toEvent(rows[0]);
  }

  async updateEvent(
    id: string,
    data: Partial<{
      eventName: string;
      eventType: string;
      eventDate: Date;
      isPublished: boolean;
      countdownActive: boolean;
    }>
  ): Promise<Event> {
    const db = getDb();
    const updateData: Record<string, unknown> = {};
    if (data.eventName !== undefined) updateData.eventName = data.eventName;
    if (data.eventType !== undefined) updateData.eventType = data.eventType;
    if (data.eventDate !== undefined) updateData.eventDate = data.eventDate;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.countdownActive !== undefined) updateData.countdownActive = data.countdownActive;

    const rows = await db.update(events).set(updateData).where(eq(events.id, id)).returning();

    if (rows.length === 0) {
      throw new Error(`Event not found: ${id}`);
    }
    return toEvent(rows[0]);
  }

  async deleteEvent(id: string): Promise<void> {
    const db = getDb();
    const rows = await db.delete(events).where(eq(events.id, id)).returning();
    if (rows.length === 0) {
      throw new Error(`Event not found: ${id}`);
    }
  }

  async createProgramAssignment(data: {
    eventId: string;
    subDepartmentId: string;
    programTitle: string;
    assignedMembers: string;
  }): Promise<EventProgramAssignment> {
    const db = getDb();
    const rows = await db
      .insert(eventProgramAssignments)
      .values({
        eventId: data.eventId,
        subDepartmentId: data.subDepartmentId,
        programTitle: data.programTitle,
        assignedMembers: data.assignedMembers,
      })
      .returning();
    return toProgramAssignment(rows[0]);
  }

  async findProgramAssignmentsByEventId(eventId: string): Promise<EventProgramAssignment[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(eventProgramAssignments)
      .where(eq(eventProgramAssignments.eventId, eventId));
    return rows.map(toProgramAssignment);
  }
}
