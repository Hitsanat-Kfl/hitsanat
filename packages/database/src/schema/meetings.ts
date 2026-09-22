import { members } from "./identity.js";
import { annualMasterPlans } from "./planning.js";
import { index, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Leadership Meetings table (FR-13.1.1 / BR-019)
 * Stores leadership meetings. Create/update/cancel and minutes are managed
 * by the BR-019 trio: CHAIRPERSON, SUB_CHAIRPERSON, and SECRETARY.
 */
export const meetings = pgTable(
  "meetings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").default(60).notNull(),
    location: varchar("location", { length: 255 }),
    agenda: text("agenda"),
    /** Scheduled | Completed | Cancelled */
    status: varchar("status", { length: 16 }).default("Scheduled").notNull(),
    minutes: text("minutes"),
    minutesRecordedBy: uuid("minutes_recorded_by"),
    minutesRecordedAt: timestamp("minutes_recorded_at", { withTimezone: true }),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Dashboard queries list upcoming meetings first.
    { meetingsScheduledAtIdx: index("meetings_scheduled_at_idx").on(table.scheduledAt) },
    { meetingsStatusIdx: index("meetings_status_idx").on(table.status) },
  ]
);

export type Meeting = typeof meetings.$inferSelect;
export type NewMeeting = typeof meetings.$inferInsert;

/**
 * Meeting Invitees table (FR-13.1.1 / BR-019)
 * Invitees must be active leadership members (executive or sub-dept leaders).
 */
export const meetingInvitees = pgTable(
  "meeting_invitees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    memberId: uuid("member_id").references(() => members.id, { onDelete: "set null" }),
    /** Pending | Accepted | Declined | Attended | Absent */
    responseStatus: varchar("response_status", { length: 16 }).default("Pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    { meetingInviteesMeetingIdx: index("meeting_invitees_meeting_idx").on(table.meetingId) },
  ]
);

export type MeetingInvitee = typeof meetingInvitees.$inferSelect;
export type NewMeetingInvitee = typeof meetingInvitees.$inferInsert;

/**
 * Plan Approvals table (FR-17.1 / BR-025)
 * EKD_LEADER submits plan changes for Chairperson approval.
 * Status: Pending | Approved | Rejected | Revision_Needed
 */
export const planApprovals = pgTable(
  "plan_approvals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    annualPlanId: uuid("annual_plan_id")
      .notNull()
      .references(() => annualMasterPlans.id, { onDelete: "cascade" }),
    requestedBy: uuid("requested_by").notNull(),
    changeSummary: text("change_summary").notNull(),
    /** Pending | Approved | Rejected | Revision_Needed */
    status: varchar("status", { length: 24 }).default("Pending").notNull(),
    reviewComments: text("review_comments"),
    reviewedBy: uuid("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    { planApprovalsPlanIdx: index("plan_approvals_plan_idx").on(table.annualPlanId) },
    { planApprovalsStatusIdx: index("plan_approvals_status_idx").on(table.status) },
  ]
);

export type PlanApproval = typeof planApprovals.$inferSelect;
export type NewPlanApproval = typeof planApprovals.$inferInsert;

// Note: FK to members.id is a plain uuid column (no FK constraint) to avoid a
// circular import with identity.ts; integrity is enforced at the use-case layer.
