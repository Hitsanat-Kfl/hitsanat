import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema/index.js";

/**
 * Creates a database client configured with connection pooling.
 * Compatible with local PostgreSQL and Supabase PostgreSQL.
 */
export function createDatabaseClient(connectionString?: string) {
  const url = connectionString || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  // Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
  const client = postgres(url, {
    prepare: false,
    max: process.env.NODE_ENV === "production" ? 20 : 5,
  });

  const db = drizzle(client, { schema });
  return { db, client };
}

export type DatabaseInstance = ReturnType<typeof createDatabaseClient>["db"];

// Singleton database instance for application runtime if DATABASE_URL is set
let _dbInstance: DatabaseInstance | null = null;

export function getDb(): DatabaseInstance {
  if (!_dbInstance) {
    const { db } = createDatabaseClient();
    _dbInstance = db;
  }
  return _dbInstance;
}
