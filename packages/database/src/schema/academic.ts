import { boolean, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Academic Assessments table
 * Stores assessment information (Mid Exam, Final Exam, Assignment)
 */
export const academicAssessments = pgTable("academic_assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  curriculumId: uuid("curriculum_id").notNull(),
  assessmentType: varchar("assessment_type", { length: 32 }).notNull(),
  subjectTopic: varchar("subject_topic", { length: 255 }).notNull(),
  maxScore: numeric("max_score", { precision: 5, scale: 2 }).notNull(),
  academicPeriod: varchar("academic_period", { length: 32 }).notNull(),
  examDate: timestamp("exam_date", { withTimezone: true }).notNull(),
});

export type AcademicAssessment = typeof academicAssessments.$inferSelect;
export type NewAcademicAssessment = typeof academicAssessments.$inferInsert;

/**
 * Student Scores table
 * Records scores achieved by children in assessments
 */
export const studentScores = pgTable("student_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  academicAssessmentId: uuid("academic_assessment_id")
    .notNull()
    .references(() => academicAssessments.id, { onDelete: "cascade" }),
  childId: uuid("child_id").notNull(),
  scoreAchieved: numeric("score_achieved", { precision: 5, scale: 2 }).notNull(),
  recordedBy: uuid("recorded_by").notNull(),
});

export type StudentScore = typeof studentScores.$inferSelect;
export type NewStudentScore = typeof studentScores.$inferInsert;

/**
 * Announcements table
 * Stores ministry announcements
 */
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  targetAudience: varchar("target_audience", { length: 32 }).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  publishToTelegram: boolean("publish_to_telegram").default(false).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdBy: uuid("created_by").notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;

/**
 * Audit Logs table
 * Records system actions for security and compliance
 */
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  operatorId: uuid("operator_id").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  resourceType: varchar("resource_type", { length: 64 }).notNull(),
  resourceId: uuid("resource_id").notNull(),
  payloadDiff: text("payload_diff"),
  ipAddress: varchar("ip_address", { length: 45 }),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
