export * from "./client/index.js";
export * from "./schema/index.js";

// Re-export drizzle-orm comparison and filter operators so that consumers
// share the same type resolution context as the schema definitions.
export { eq, and, or, ilike, desc, count } from "drizzle-orm";
