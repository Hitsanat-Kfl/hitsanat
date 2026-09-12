import { and, count, desc, eq, getDb } from "@repo/database";
import { announcements } from "@repo/database/schema";
import type { Announcement } from "@repo/domain";
import type { AnnouncementsRepository } from "../../domain/repositories/announcements.repository.js";

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

export class DrizzleAnnouncementsRepository implements AnnouncementsRepository {
  async findAnnouncementById(id: string): Promise<Announcement | null> {
    const db = getDb();
    const rows = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
    return rows.length > 0 ? toAnnouncement(rows[0]) : null;
  }

  async findManyAnnouncements(params: {
    page?: number;
    limit?: number;
    targetAudience?: string;
    isPublished?: boolean;
  }): Promise<{
    success: boolean;
    data: Announcement[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const conditions = [];
    if (params.targetAudience) {
      conditions.push(eq(announcements.targetAudience, params.targetAudience));
    }
    if (params.isPublished !== undefined) {
      conditions.push(eq(announcements.isPublished, params.isPublished));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(announcements)
        .where(whereClause)
        .orderBy(desc(announcements.publishedAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(announcements).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toAnnouncement),
      pagination: { page, limit, total, totalPages },
    };
  }

  async createAnnouncement(data: {
    title: string;
    content: string;
    targetAudience: string;
    createdBy: string;
  }): Promise<Announcement> {
    const db = getDb();
    const rows = await db
      .insert(announcements)
      .values({
        title: data.title,
        content: data.content,
        targetAudience: data.targetAudience,
        createdBy: data.createdBy,
        isPublished: false,
        publishToTelegram: false,
      })
      .returning();
    return toAnnouncement(rows[0]);
  }

  async updateAnnouncement(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      targetAudience: string;
    }>
  ): Promise<Announcement> {
    const db = getDb();
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.targetAudience !== undefined) updateData.targetAudience = data.targetAudience;

    const rows = await db
      .update(announcements)
      .set(updateData)
      .where(eq(announcements.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`Announcement not found: ${id}`);
    }
    return toAnnouncement(rows[0]);
  }

  async publishAnnouncement(id: string): Promise<Announcement> {
    const db = getDb();
    const rows = await db
      .update(announcements)
      .set({
        isPublished: true,
        publishedAt: new Date(),
      })
      .where(eq(announcements.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`Announcement not found: ${id}`);
    }
    return toAnnouncement(rows[0]);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const db = getDb();
    const rows = await db.delete(announcements).where(eq(announcements.id, id)).returning();
    if (rows.length === 0) {
      throw new Error(`Announcement not found: ${id}`);
    }
  }
}
