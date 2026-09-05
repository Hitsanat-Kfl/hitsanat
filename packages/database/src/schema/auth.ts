import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Users table for Better Auth
 * Stores leadership accounts only (ADR-0007: regular members have no accounts)
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: varchar("role", { length: 64 }).default("MEMBER_REGULAR").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

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
