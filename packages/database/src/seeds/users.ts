import { randomBytes, scrypt } from "node:crypto";
import { resolve } from "node:path";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load .env from packages/database directory
dotenv.config({ path: resolve(__dirname, "../../.env") });

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgrespassword@localhost:5432/hitsanat_dev";

// Better Auth scrypt config (matches @better-auth/utils/password)
const SCRYPT_CONFIG = { N: 16384, r: 16, p: 1, dkLen: 64 };

function hexEncode(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      SCRYPT_CONFIG.dkLen,
      {
        N: SCRYPT_CONFIG.N,
        r: SCRYPT_CONFIG.r,
        p: SCRYPT_CONFIG.p,
        maxmem: 128 * SCRYPT_CONFIG.N * SCRYPT_CONFIG.r * 2,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });
  return `${hexEncode(salt)}:${hexEncode(key)}`;
}

// ─── Test users for each role ────────────────────────────────────────────────
const users = [
  {
    name: "Super Admin",
    email: "superadmin@hitsanat.org",
    password: "password123",
    role: "SUPER_ADMIN",
  },
  {
    name: "Chairperson",
    email: "chairperson@hitsanat.org",
    password: "password123",
    role: "CHAIRPERSON",
  },
  {
    name: "Sub-Chairperson",
    email: "subchairperson@hitsanat.org",
    password: "password123",
    role: "SUB_CHAIRPERSON",
  },
  {
    name: "Secretary",
    email: "secretary@hitsanat.org",
    password: "password123",
    role: "SECRETARY",
  },
  {
    name: "Leader User",
    email: "leader@hitsanat.org",
    password: "password123",
    role: "CHAIRPERSON",
  },
  {
    name: "Regular Member",
    email: "member@hitsanat.org",
    password: "password123",
    role: "MEMBER_REGULAR",
  },
];

async function seed() {
  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log("Seeding users...\n");

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);

    // Insert user
    const result = await db.execute(sql`
      INSERT INTO users (name, email, email_verified, role)
      VALUES (${user.name}, ${user.email}, true, ${user.role})
      ON CONFLICT (email) DO UPDATE SET
        name = ${user.name},
        role = ${user.role},
        updated_at = NOW()
      RETURNING id
    `);

    const userId = result[0]?.id;
    if (!userId) {
      console.log(`  Skipped: ${user.email} (already exists)`);
      continue;
    }

    // Insert account with hashed password
    // Better Auth stores accounts with provider_id = "credential" for email/password
    // Delete existing account first since accounts table may not have a unique constraint on (account_id, provider_id)
    await db.execute(
      sql`DELETE FROM accounts WHERE account_id = ${user.email} AND provider_id = 'credential'`
    );
    await db.execute(sql`
      INSERT INTO accounts (account_id, provider_id, user_id, password)
      VALUES (${user.email}, 'credential', ${userId}, ${hashedPassword})
    `);

    console.log(`  Created: ${user.email} (${user.role}) / password: ${user.password}`);
  }

  console.log("\nSeeding complete!");
  console.log("\n─── Login Credentials ───────────────────────────────────");
  console.log("  All users use password: password123\n");
  for (const u of users) {
    console.log(`  ${u.role.padEnd(20)} ${u.email}`);
  }
  console.log("──────────────────────────────────────────────────────────\n");

  await client.end();
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
