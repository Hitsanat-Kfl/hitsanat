import { count, desc, eq, getDb } from "@repo/database";
import {
  children,
  members,
  programSessionAttendance,
  programSessions,
} from "@repo/database/schema";
import type { ProgramSession, ProgramSessionAttendance } from "@repo/domain";
import { AttendanceStatus, PersonType } from "@repo/domain";
import type { AttendanceRepository } from "../../domain/repositories/attendance.repository.js";

function toSession(row: typeof programSessions.$inferSelect): ProgramSession {
  return {
    id: row.id,
    sessionType: row.sessionType as ProgramSession["sessionType"],
    sessionDate: new Date(row.sessionDate),
    startTime: row.startTime,
    endTime: row.endTime,
    createdAt: new Date(),
  };
}

function toAttendance(row: typeof programSessionAttendance.$inferSelect): ProgramSessionAttendance {
  return {
    id: row.id,
    programSessionId: row.programSessionId,
    personType: row.personType as ProgramSessionAttendance["personType"],
    personId: row.personId,
    collectionLocation: row.collectionLocation ?? undefined,
    status: row.status as ProgramSessionAttendance["status"],
    recordedBy: row.recordedBy,
    confirmedAt: row.confirmedAt ?? undefined,
    createdAt: new Date(),
  };
}

export class DrizzleAttendanceRepository implements AttendanceRepository {
  async findSessionById(id: string): Promise<ProgramSession | null> {
    const db = getDb();
    const rows = await db.select().from(programSessions).where(eq(programSessions.id, id)).limit(1);
    return rows.length > 0 ? toSession(rows[0]) : null;
  }

  async findManySessions(params: {
    page?: number;
    limit?: number;
    sessionType?: string;
  }): Promise<{
    success: boolean;
    data: ProgramSession[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const whereClause = params.sessionType
      ? eq(programSessions.sessionType, params.sessionType)
      : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(programSessions)
        .where(whereClause)
        .orderBy(desc(programSessions.sessionDate))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(programSessions).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toSession),
      pagination: { page, limit, total, totalPages },
    };
  }

  async createSession(data: {
    sessionType: string;
    sessionDate: string;
    startTime: Date;
    endTime: Date;
  }): Promise<ProgramSession> {
    const db = getDb();
    const rows = await db
      .insert(programSessions)
      .values({
        sessionType: data.sessionType,
        sessionDate: data.sessionDate,
        startTime: data.startTime,
        endTime: data.endTime,
      })
      .returning();
    return toSession(rows[0]);
  }

  async findAttendanceBySessionId(sessionId: string): Promise<ProgramSessionAttendance[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(programSessionAttendance)
      .where(eq(programSessionAttendance.programSessionId, sessionId));
    return rows.map(toAttendance);
  }

  async createAttendanceRecords(
    data: {
      programSessionId: string;
      personType: string;
      personId: string;
      collectionLocation?: string | null;
      status: string;
      recordedBy: string;
    }[]
  ): Promise<ProgramSessionAttendance[]> {
    const db = getDb();
    if (data.length === 0) return [];
    const rows = await db
      .insert(programSessionAttendance)
      .values(
        data.map((d) => ({
          programSessionId: d.programSessionId,
          personType: d.personType,
          personId: d.personId,
          collectionLocation: d.collectionLocation ?? null,
          status: d.status,
          recordedBy: d.recordedBy,
          confirmedAt: null,
        }))
      )
      .returning();
    return rows.map(toAttendance);
  }

  async updateAttendanceRecord(
    id: string,
    data: {
      status: string;
      recordedBy: string;
      confirmedAt: Date;
    }
  ): Promise<ProgramSessionAttendance> {
    const db = getDb();
    const rows = await db
      .update(programSessionAttendance)
      .set({
        status: data.status,
        recordedBy: data.recordedBy,
        confirmedAt: data.confirmedAt,
      })
      .where(eq(programSessionAttendance.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`Attendance record not found: ${id}`);
    }
    return toAttendance(rows[0]);
  }

  async batchUpdateAttendance(
    records: { id: string; status: string; recordedBy: string }[]
  ): Promise<ProgramSessionAttendance[]> {
    const db = getDb();
    const results: ProgramSessionAttendance[] = [];

    for (const record of records) {
      const rows = await db
        .update(programSessionAttendance)
        .set({
          status: record.status,
          recordedBy: record.recordedBy,
          confirmedAt: new Date(),
        })
        .where(eq(programSessionAttendance.id, record.id))
        .returning();
      if (rows.length > 0) {
        results.push(toAttendance(rows[0]));
      }
    }

    return results;
  }

  async findActiveMembers(): Promise<{ id: string }[]> {
    const db = getDb();
    const rows = await db
      .select({ id: members.id })
      .from(members)
      .where(eq(members.isActive, true));
    return rows;
  }

  async findActiveChildren(): Promise<{ id: string; collectionLocation: string | null }[]> {
    const db = getDb();
    const rows = await db
      .select({ id: children.id, collectionLocation: children.collectionLocation })
      .from(children)
      .where(eq(children.isActive, true));
    return rows.map((r) => ({ id: r.id, collectionLocation: r.collectionLocation }));
  }
}
