import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Members table
 * Stores university student servants information
 */
export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  christianName: varchar("christian_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 32 }).notNull().unique(),
  yearOfStudy: varchar("year_of_study", { length: 32 }).notNull(),
  academicDepartment: varchar("academic_department", { length: 255 }).notNull(),
  campus: varchar("campus", { length: 128 }).notNull(),
  gender: varchar("gender", { length: 16 }).notNull(),
  photoUrl: text("photo_url"),
  telegramUsername: varchar("telegram_username", { length: 128 }),
  dateJoined: timestamp("date_joined", { withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

/**
 * Sub-Departments table
 * Stores ministry sub-departments (Timihrt, Mezmur, Kutitr, Ekd, Kinetibeb)
 */
export const subDepartments = pgTable("sub_departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  nameAm: varchar("name_am", { length: 128 }).notNull(),
  nameEn: varchar("name_en", { length: 128 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SubDepartment = typeof subDepartments.$inferSelect;
export type NewSubDepartment = typeof subDepartments.$inferInsert;

/**
 * Sub-Department Members table
 * Join table with scoped roles for member-department assignments
 */
export const subDepartmentMembers = pgTable("sub_department_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  subDepartmentId: uuid("sub_department_id")
    .notNull()
    .references(() => subDepartments.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 64 }).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SubDepartmentMember = typeof subDepartmentMembers.$inferSelect;
export type NewSubDepartmentMember = typeof subDepartmentMembers.$inferInsert;

/**
 * Families table
 * Stores family units (ቤተሰብ / Khnet)
 */
export const families = pgTable("families", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyName: varchar("family_name", { length: 128 }).notNull(),
  fatherMemberId: uuid("father_member_id").references(() => members.id, { onDelete: "set null" }),
  motherMemberId: uuid("mother_member_id").references(() => members.id, { onDelete: "set null" }),
  academicYear: varchar("academic_year", { length: 32 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Family = typeof families.$inferSelect;
export type NewFamily = typeof families.$inferInsert;

/**
 * Family Members table
 * Links members to families
 */
export const familyMembers = pgTable("family_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
});

export type FamilyMember = typeof familyMembers.$inferSelect;
export type NewFamilyMember = typeof familyMembers.$inferInsert;
