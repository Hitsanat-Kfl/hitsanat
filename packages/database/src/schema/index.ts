import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * System metadata / health check table for verifying database connectivity
 */
export const systemMetadata = pgTable("system_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SystemMetadata = typeof systemMetadata.$inferSelect;
export type NewSystemMetadata = typeof systemMetadata.$inferInsert;

// Identity & Governance
export * from "./identity.js";

// Beneficiaries & Parents
export * from "./beneficiaries.js";

// Planning & Strategy
export * from "./planning.js";

// Attendance & Events
export * from "./attendance.js";

// Academic & Announcements
export * from "./academic.js";

// Reports & Analytics
export * from "./reports.js";

// Auth & Session Management
export * from "./auth.js";

// Leadership Meetings & Plan Approvals
export * from "./meetings.js";
