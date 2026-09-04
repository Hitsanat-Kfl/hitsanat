import { boolean, date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Program Sessions table
 * Stores Saturday and Sunday session information
 */
export const programSessions = pgTable("program_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionType: varchar("session_type", { length: 16 }).notNull(),
  sessionDate: date("session_date").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
});

export type ProgramSession = typeof programSessions.$inferSelect;
export type NewProgramSession = typeof programSessions.$inferInsert;

/**
 * Program Session Attendance table
 * Records attendance for each session
 */
export const programSessionAttendance = pgTable("program_session_attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  programSessionId: uuid("program_session_id").notNull().references(() => programSessions.id, { onDelete: "cascade" }),
  personType: varchar("person_type", { length: 16 }).notNull(),
  personId: uuid("person_id").notNull(),
  collectionLocation: varchar("collection_location", { length: 64 }),
  status: varchar("status", { length: 16 }).notNull(),
  recordedBy: uuid("recorded_by").notNull(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
});

export type ProgramSessionAttendance = typeof programSessionAttendance.$inferSelect;
export type NewProgramSessionAttendance = typeof programSessionAttendance.$inferInsert;

/**
 * Events table
 * Stores special events (Timket, Hosaena, Awdemerit, Adar)
 */
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventName: varchar("event_name", { length: 255 }).notNull(),
  eventType: varchar("event_type", { length: 32 }).notNull(),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  countdownActive: boolean("countdown_active").default(false).notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

/**
 * Event Program Assignments table
 * Assigns program segments to sub-departments
 */
export const eventProgramAssignments = pgTable("event_program_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  subDepartmentId: uuid("sub_department_id").notNull(),
  programTitle: varchar("program_title", { length: 255 }).notNull(),
  assignedMembers: text("assigned_members"),
});

export type EventProgramAssignment = typeof eventProgramAssignments.$inferSelect;
export type NewEventProgramAssignment = typeof eventProgramAssignments.$inferInsert;

/**
 * Event Attendance table
 * Records attendance for special events
 */
export const eventAttendance = pgTable("event_attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  personType: varchar("person_type", { length: 16 }).notNull(),
  personId: uuid("person_id").notNull(),
  status: varchar("status", { length: 16 }).notNull(),
  recordedBy: uuid("recorded_by").notNull(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
});

export type EventAttendance = typeof eventAttendance.$inferSelect;
export type NewEventAttendance = typeof eventAttendance.$inferInsert;