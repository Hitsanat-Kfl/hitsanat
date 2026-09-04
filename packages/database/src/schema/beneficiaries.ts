import { boolean, date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Children (Beneficiaries) table
 * Stores information about children enrolled in the ministry
 */
export const children = pgTable("children", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  christianName: varchar("christian_name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 16 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  address: text("address").notNull(),
  kutrGroup: varchar("kutr_group", { length: 16 }).notNull(),
  collectionLocation: varchar("collection_location", { length: 64 }).notNull(),
  photoUrl: text("photo_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Child = typeof children.$inferSelect;
export type NewChild = typeof children.$inferInsert;

/**
 * Parents table
 * Stores parent/guardian information
 */
export const parents = pgTable("parents", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 32 }).notNull(),
  secondaryPhone: varchar("secondary_phone", { length: 32 }),
  address: text("address").notNull(),
  occupation: varchar("occupation", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Parent = typeof parents.$inferSelect;
export type NewParent = typeof parents.$inferInsert;

/**
 * Child-Parent relationship table
 * Enforces max 1 Father and 1 Mother per child via UNIQUE constraint
 */
export const childParents = pgTable("child_parents", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: uuid("child_id")
    .notNull()
    .references(() => children.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id")
    .notNull()
    .references(() => parents.id, { onDelete: "restrict" }),
  relation: varchar("relation", { length: 16 }).notNull(),
});

export type ChildParent = typeof childParents.$inferSelect;
export type NewChildParent = typeof childParents.$inferInsert;
