import { integer, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Annual Master Plans table
 * Stores yearly strategic plans for the ministry
 */
export const annualMasterPlans = pgTable("annual_master_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  academicYear: varchar("academic_year", { length: 32 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  totalBudget: numeric("total_budget", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalPeople: integer("total_people").default(0).notNull(),
  totalTime: integer("total_time").default(0).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  createdBy: uuid("created_by").notNull(),
  approvedBy: uuid("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
});

export type AnnualMasterPlan = typeof annualMasterPlans.$inferSelect;
export type NewAnnualMasterPlan = typeof annualMasterPlans.$inferInsert;

/**
 * Plan Goals table
 * Stores goals within an annual master plan
 */
export const planGoals = pgTable("plan_goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  annualPlanId: uuid("annual_plan_id")
    .notNull()
    .references(() => annualMasterPlans.id, { onDelete: "cascade" }),
  goalNumber: integer("goal_number").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PlanGoal = typeof planGoals.$inferSelect;
export type NewPlanGoal = typeof planGoals.$inferInsert;

/**
 * Plan Activities table
 * Stores activities under each goal with weight calculation
 */
export const planActivities = pgTable("plan_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  planGoalId: uuid("plan_goal_id")
    .notNull()
    .references(() => planGoals.id, { onDelete: "cascade" }),
  activityNumber: integer("activity_number").notNull(),
  mainActivity: text("main_activity").notNull(),
  expectedResult: text("expected_result"),
  annualTarget: integer("annual_target").notNull(),
  budget: numeric("budget", { precision: 10, scale: 2 }).default("0.00").notNull(),
  humanResource: integer("human_resource").default(0).notNull(),
  plannedTime: integer("planned_time").default(0).notNull(),
  weight: numeric("weight", { precision: 6, scale: 4 }).notNull(),
  q1Target: integer("q1_target").default(0).notNull(),
  q2Target: integer("q2_target").default(0).notNull(),
  q3Target: integer("q3_target").default(0).notNull(),
  q4Target: integer("q4_target").default(0).notNull(),
});

export type PlanActivity = typeof planActivities.$inferSelect;
export type NewPlanActivity = typeof planActivities.$inferInsert;

/**
 * Plan Distributions table
 * Distributes activities to sub-departments
 */
export const planDistributions = pgTable("plan_distributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  planActivityId: uuid("plan_activity_id")
    .notNull()
    .references(() => planActivities.id, { onDelete: "cascade" }),
  subDepartmentId: uuid("sub_department_id").notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PlanDistribution = typeof planDistributions.$inferSelect;
export type NewPlanDistribution = typeof planDistributions.$inferInsert;

/**
 * Weekly Plans table
 * Stores weekly execution tasks
 */
export const weeklyPlans = pgTable("weekly_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  planDistributionId: uuid("plan_distribution_id")
    .notNull()
    .references(() => planDistributions.id, { onDelete: "cascade" }),
  ethiopianMonth: varchar("ethiopian_month", { length: 32 }).notNull(),
  weekNumber: integer("week_number").notNull(),
  sessionDate: timestamp("session_date", { withTimezone: true }).notNull(),
  taskDescription: text("task_description").notNull(),
});

export type WeeklyPlan = typeof weeklyPlans.$inferSelect;
export type NewWeeklyPlan = typeof weeklyPlans.$inferInsert;

/**
 * Plan Progress Records table
 * Records progress for weekly tasks
 */
export const planProgressRecords = pgTable("plan_progress_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  weeklyPlanId: uuid("weekly_plan_id")
    .notNull()
    .references(() => weeklyPlans.id, { onDelete: "cascade" }),
  actualResultNumeric: integer("actual_result_numeric"),
  actualResultText: text("actual_result_text"),
  status: varchar("status", { length: 32 }).notNull(),
  challenges: text("challenges"),
  submittedBy: uuid("submitted_by").notNull(),
});

export type PlanProgressRecord = typeof planProgressRecords.$inferSelect;
export type NewPlanProgressRecord = typeof planProgressRecords.$inferInsert;
