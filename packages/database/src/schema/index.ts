import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * System metadata / health check table for verifying database connectivity
 * Domain tables will be added in subsequent implementation phases.
 */
export const systemMetadata = pgTable("system_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SystemMetadata = typeof systemMetadata.$inferSelect;
export type NewSystemMetadata = typeof systemMetadata.$inferInsert;
