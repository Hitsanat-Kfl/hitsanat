import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgrespassword@localhost:5432/hitsanat_dev";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function wipeAndSeed() {
  const client = postgres(connectionString);
  const db = drizzle(client);

  // ── Step 1: Wipe Supabase Auth users ──────────────────────────────────
  console.log("=== Step 1: Wiping Supabase Auth users ===\n");

  let page = 0;
  let totalDeleted = 0;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) {
      console.error("Error listing users:", error.message);
      break;
    }
    if (!data.users.length) break;

    for (const user of data.users) {
      const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
      if (delError) {
        console.error(`  Failed to delete ${user.email}: ${delError.message}`);
      } else {
        totalDeleted++;
      }
    }
    page++;
  }
  console.log(`  Deleted ${totalDeleted} auth users from Supabase\n`);

  // ── Step 2: Wipe local users & accounts tables ────────────────────────
  console.log("=== Step 2: Wiping local users & accounts tables ===\n");
  await db.execute(sql`DELETE FROM accounts`);
  await db.execute(sql`DELETE FROM users`);
  console.log("  Cleared accounts table");
  console.log("  Cleared users table\n");

  // ── Step 3: Seed new users ────────────────────────────────────────────
  console.log("=== Step 3: Seeding new users ===\n");

  for (const user of users) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { name: user.name, role: user.role },
    });

    if (authError) {
      console.error(`  Error creating ${user.email}: ${authError.message}`);
      continue;
    }

    const authUserId = authData.user.id;

    await db.execute(sql`
      INSERT INTO users (id, name, email, email_verified, role)
      VALUES (${authUserId}, ${user.name}, ${user.email}, true, ${user.role})
    `);

    console.log(`  Created: ${user.email} (${user.role}) / password: ${user.password}`);
  }

  console.log("\n=== Done! ===");
  console.log("\n─── Login Credentials ───────────────────────────────────");
  console.log("  All users use password: password123\n");
  for (const u of users) {
    console.log(`  ${u.role.padEnd(20)} ${u.email}`);
  }
  console.log("──────────────────────────────────────────────────────────\n");

  await client.end();
}

wipeAndSeed().catch((error) => {
  console.error("Wipe & seed failed:", error);
  process.exit(1);
});
