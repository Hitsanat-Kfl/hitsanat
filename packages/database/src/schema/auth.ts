import { boolean, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { members } from "./identity.js";

/**
 * Leadership roles that REQUIRE a linked member (BR-007).
 */
export const LEADERSHIP_ROLES = [
  "SUPER_ADMIN",
  "CHAIRPERSON",
  "SUB_CHAIRPERSON",
  "SECRETARY",
] as const;

export type LeadershipRole = (typeof LEADERSHIP_ROLES)[number];

/**
 * Account lifecycle status (FR-13.6): deactivation must be distinguishable
 * from unverified email so accounts can be reactivated cleanly.
 */
export const ACCOUNT_STATUS = ["ACTIVE", "DEACTIVATED"] as const;

export type AccountStatus = (typeof ACCOUNT_STATUS)[number];

/**
 * Users table
 * Stores leadership accounts only (ADR-0007: regular members have no accounts).
 *
 * BR-007: Every leadership account MUST be linked to a registered member
 * via `memberId`. Enforced by the `users_leadership_requires_member_check`
 * constraint in migration 0003.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: varchar("role", { length: 64 }).default("MEMBER_REGULAR").notNull(),
    /** Lifecycle status: ACTIVE or DEACTIVATED (banned in Supabase Auth). */
    status: varchar("status", { length: 16 }).default("ACTIVE").notNull(),
    /** When the account was deactivated (null while active). */
    deactivatedAt: timestamp("deactivated_at", { withTimezone: true }),
    memberId: uuid("member_id").references(() => members.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // One user account per member (supports BR-007 leadership linking)
    {
      usersMemberIdUnique: unique().on(table.memberId),
    },
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * Sessions table for Better Auth
 */
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

/**
 * Accounts table for Better Auth (OAuth providers)
 */
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  issuer: varchar("issuer", { length: 255 }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

/**
 * Verification tokens for Better Auth
 */
export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
