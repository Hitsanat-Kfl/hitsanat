/**
 * One-off baseline script: the remote database already has all objects from
 * migrations 0000-0002 (applied before the journal existed), but
 * drizzle.__drizzle_migrations is empty. Insert journal rows for those three
 * migrations so `drizzle-kit migrate` only applies 0003+ going forward.
 *
 * Hash format: sha256 hex of the raw migration file content — the same
 * computation drizzle-kit uses when it records applied migrations.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import postgres from "postgres";

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, "..", "src", "migrations");

const alreadyApplied = [
  "0000_strong_justin_hammer",
  "0001_add_constraints",
  "0002_add_auth_tables",
];

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const client = postgres(connectionString, { max: 1 });

const existing = await client`SELECT count(*)::int as count FROM drizzle.__drizzle_migrations`;
const count = (existing[0] as { count: number }).count;
if (count > 0) {
  console.log(`Journal already has ${count} entries — nothing to baseline.`);
  await client.end();
  process.exit(0);
}

// Use the local journal's timestamps: drizzle's migrator applies local
// migrations when their timestamp is newer than the last applied row, so
// baseline rows must carry the historical "when" values — not Date.now().
const journal = JSON.parse(readFileSync(join(migrationsDir, "meta", "_journal.json"), "utf8")) as {
  entries: Array<{ idx: number; when: number; tag: string }>;
};

for (const tag of alreadyApplied) {
  const entry = journal.entries.find((e) => e.tag === tag);
  if (!entry) throw new Error(`Migration ${tag} not found in local journal`);

  const sql = readFileSync(join(migrationsDir, `${tag}.sql`), "utf8");
  const hash = createHash("sha256").update(sql).digest("hex");
  await client`
    INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
    VALUES (${hash}, ${entry.when})
  `;
  console.log(`Baselined: ${tag} (${hash.slice(0, 12)}...)`);
}

console.log("\nDone. `pnpm db:migrate` will now only apply migrations after 0002.");
await client.end();
