import {
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Periodic Reports table
 * Stores generated periodic performance reports (Weekly, Monthly, Quarterly, Half-Year, Annual)
 */
export const periodicReports = pgTable("periodic_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportType: varchar("report_type", { length: 16 }).notNull(),
  periodLabel: varchar("period_label", { length: 64 }).notNull(),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  subDepartmentId: uuid("sub_department_id"),
  generatedBy: uuid("generated_by").notNull(),
  status: varchar("status", { length: 16 }).default("Draft").notNull(),
  metrics: jsonb("metrics"),
  challenges: text("challenges"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PeriodicReport = typeof periodicReports.$inferSelect;
export type NewPeriodicReport = typeof periodicReports.$inferInsert;

/**
 * Report Submissions table
 * Sub-departments submit periodic performance data to Ekd
 */
export const reportSubmissions = pgTable("report_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportType: varchar("report_type", { length: 16 }).notNull(),
  periodLabel: varchar("period_label", { length: 64 }).notNull(),
  subDepartmentId: uuid("sub_department_id").notNull(),
  submittedBy: uuid("submitted_by").notNull(),
  status: varchar("status", { length: 16 }).default("Submitted").notNull(),
  metrics: jsonb("metrics"),
  challenges: text("challenges"),
  notes: text("notes"),
  reviewedBy: uuid("reviewed_by"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ReportSubmission = typeof reportSubmissions.$inferSelect;
export type NewReportSubmission = typeof reportSubmissions.$inferInsert;
