import { and, count, desc, eq, getDb, ilike, or } from "@repo/database";
import { academicAssessments, studentScores } from "@repo/database/schema";
import type { AcademicAssessment, StudentScore } from "@repo/domain";
import type { AcademicRepository } from "../../domain/repositories/academic.repository.js";

function toAssessment(row: typeof academicAssessments.$inferSelect): AcademicAssessment {
  return {
    id: row.id,
    curriculumId: row.curriculumId,
    assessmentType: row.assessmentType as AcademicAssessment["assessmentType"],
    subjectTopic: row.subjectTopic,
    maxScore: Number(row.maxScore),
    academicPeriod: row.academicPeriod,
    examDate: row.examDate,
    createdAt: new Date(),
  };
}

function toScore(row: typeof studentScores.$inferSelect): StudentScore {
  return {
    id: row.id,
    academicAssessmentId: row.academicAssessmentId,
    childId: row.childId,
    scoreAchieved: Number(row.scoreAchieved),
    recordedBy: row.recordedBy,
    createdAt: new Date(),
  };
}

export class DrizzleAcademicRepository implements AcademicRepository {
  async findAssessmentById(id: string): Promise<AcademicAssessment | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(academicAssessments)
      .where(eq(academicAssessments.id, id))
      .limit(1);
    return rows.length > 0 ? toAssessment(rows[0]) : null;
  }

  async findManyAssessments(params: {
    page?: number;
    limit?: number;
    subjectTopic?: string;
    assessmentType?: string;
  }): Promise<{
    success: boolean;
    data: AcademicAssessment[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const conditions = [];
    if (params.subjectTopic) {
      conditions.push(ilike(academicAssessments.subjectTopic, `%${params.subjectTopic}%`));
    }
    if (params.assessmentType) {
      conditions.push(eq(academicAssessments.assessmentType, params.assessmentType));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(academicAssessments)
        .where(whereClause)
        .orderBy(desc(academicAssessments.examDate))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(academicAssessments).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toAssessment),
      pagination: { page, limit, total, totalPages },
    };
  }

  async createAssessment(
    data: Omit<AcademicAssessment, "id" | "createdAt" | "updatedAt">
  ): Promise<AcademicAssessment> {
    const db = getDb();
    const rows = await db
      .insert(academicAssessments)
      .values({
        curriculumId: data.curriculumId,
        assessmentType: data.assessmentType,
        subjectTopic: data.subjectTopic,
        maxScore: String(data.maxScore),
        academicPeriod: data.academicPeriod,
        examDate: data.examDate,
      })
      .returning();
    return toAssessment(rows[0]);
  }

  async findScoreById(id: string): Promise<StudentScore | null> {
    const db = getDb();
    const rows = await db.select().from(studentScores).where(eq(studentScores.id, id)).limit(1);
    return rows.length > 0 ? toScore(rows[0]) : null;
  }

  async findScoresByAssessmentId(assessmentId: string): Promise<StudentScore[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(studentScores)
      .where(eq(studentScores.academicAssessmentId, assessmentId));
    return rows.map(toScore);
  }

  async findScoresByChildId(childId: string): Promise<StudentScore[]> {
    const db = getDb();
    const rows = await db.select().from(studentScores).where(eq(studentScores.childId, childId));
    return rows.map(toScore);
  }

  async createScore(
    data: Omit<StudentScore, "id" | "createdAt" | "updatedAt">
  ): Promise<StudentScore> {
    const db = getDb();
    const rows = await db
      .insert(studentScores)
      .values({
        academicAssessmentId: data.academicAssessmentId,
        childId: data.childId,
        scoreAchieved: String(data.scoreAchieved),
        recordedBy: data.recordedBy,
      })
      .returning();
    return toScore(rows[0]);
  }

  async updateScore(
    id: string,
    data: Partial<Omit<StudentScore, "id" | "createdAt" | "updatedAt">>
  ): Promise<StudentScore> {
    const db = getDb();
    const updateData: Record<string, unknown> = {};
    if (data.scoreAchieved !== undefined) updateData.scoreAchieved = String(data.scoreAchieved);

    const rows = await db
      .update(studentScores)
      .set(updateData)
      .where(eq(studentScores.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`Student score not found: ${id}`);
    }
    return toScore(rows[0]);
  }
}
