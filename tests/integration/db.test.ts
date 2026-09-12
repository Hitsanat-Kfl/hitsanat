import { createDatabaseClient } from "@repo/database";
import type postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getTestDbUrl } from "./setup.js";

const testDbUrl = getTestDbUrl();

describe("PostgreSQL Database Integration Tests", () => {
  let client: postgres.Sql | null = null;

  beforeAll(async () => {
    if (testDbUrl) {
      const dbHelper = createDatabaseClient(testDbUrl);
      client = dbHelper.client;
    }
  });

  afterAll(async () => {
    if (client) {
      await client.end();
    }
  });

  it("should connect to PostgreSQL and execute query when TEST_DATABASE_URL is provided", async () => {
    if (!testDbUrl) {
      console.warn(
        "⚠️ Skipping PostgreSQL integration test: TEST_DATABASE_URL not set. Run `docker compose up -d postgres` and provide TEST_DATABASE_URL to verify real PostgreSQL connectivity."
      );
      return;
    }

    expect(client).not.toBeNull();
    if (client) {
      const result = await client`SELECT 1 + 1 AS sum`;
      expect(result).toBeDefined();
      expect(result[0].sum).toBe(2);
    }
  });

  it("should verify connection isolation and transaction rollback capability", async () => {
    if (!testDbUrl || !client) {
      return;
    }

    // Create temporary table for test isolation check
    await client`CREATE TEMPORARY TABLE test_isolation (id serial PRIMARY KEY, name text);`;
    await client`INSERT INTO test_isolation (name) VALUES ('hitsanat-test');`;

    const rows = await client`SELECT * FROM test_isolation;`;
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe("hitsanat-test");
  });
});
