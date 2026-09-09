import { count, eq, getDb } from "@repo/database";
import { members, children, events, announcements } from "@repo/database/schema";
import type { Announcement, Event } from "@repo/domain";
import type { PublicRepository, PublicStats } from "../../domain/repositories/public.repository.js";

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

function toAnnouncement(row: typeof announcements.$inferSelect): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    targetAudience: row.targetAudience as Announcement["targetAudience"],
    isPublished: row.isPublished,
    publishToTelegram: row.publishToTelegram,
    publishedAt: row.publishedAt ?? undefined,
    createdBy: row.createdBy,
    createdAt: new Date(),
  };
}

export class DrizzlePublicRepository implements PublicRepository {
  async getPublicStats(): Promise<PublicStats> {
    const db = getDb();

    const [memberCount, childCount, eventCount] = await Promise.all([
      db.select({ value: count() }).from(members).where(eq(members.isActive, true)),
      db.select({ value: count() }).from(children).where(eq(children.isActive, true)),
      db.select({ value: count() }).from(events).where(eq(events.isPublished, true)),
    ]);

    return {
      activeMembers: memberCount[0]?.value ?? 0,
      enrolledChildren: childCount[0]?.value ?? 0,
      completedEvents: eventCount[0]?.value ?? 0,
    };
  }

  async getPublishedEvents(): Promise<Event[]> {
    const db = getDb();
    const rows = await db.select().from(events).where(eq(events.isPublished, true));
    return rows.map(toEvent);
  }

  async getPublishedAnnouncements(): Promise<Announcement[]> {
    const db = getDb();
    const rows = await db.select().from(announcements).where(eq(announcements.isPublished, true));
    return rows.map(toAnnouncement);
  }
}
