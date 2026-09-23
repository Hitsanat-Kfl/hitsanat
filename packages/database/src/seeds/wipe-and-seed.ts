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

const LEADERSHIP_ROLES = ["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"];

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

/**
 * BR-007: leadership accounts require an active member link.
 * Mirrors seeds/users.ts ensureLeaderMember — create/reuse a placeholder
 * member when none exists, then return its id for users.member_id.
 */
async function ensureLeaderMember(
  db: ReturnType<typeof drizzle>,
  user: { name: string; email: string; role: string }
): Promise<string> {
  const byName = await db.execute(sql`
    SELECT id, is_active FROM members
    WHERE full_name = ${user.name} OR CONCAT(full_name, ' ', christian_name) = ${user.name}
    ORDER BY created_at ASC LIMIT 1
  `);
  const memberRow = (byName as unknown as Array<{ id: string; is_active: boolean }>)[0];
  if (memberRow) {
    if (!memberRow.is_active) {
      throw new Error(
        `BR-007 violation: member "${user.name}" is inactive — cannot link leadership account ${user.email}`
      );
    }
    return memberRow.id;
  }

  const created = await db.execute(sql`
    INSERT INTO members (full_name, christian_name, phone_number, year_of_study,
                         academic_department, campus, gender)
    VALUES (${user.name}, ${user.name}, ${`SEED-${user.email}`}, 'GC', 'Leadership', 'Main Campus', 'Male')
    RETURNING id
  `);
  const newMember = (created as unknown as Array<{ id: string }>)[0];
  console.log(`  Created placeholder member for leader: ${user.name}`);
  return newMember.id;
}

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

    // BR-007: leadership accounts must link to an active member.
    const memberId = LEADERSHIP_ROLES.includes(user.role)
      ? await ensureLeaderMember(db, user)
      : null;

    await db.execute(sql`
      INSERT INTO users (id, name, email, email_verified, role, member_id)
      VALUES (${authUserId}, ${user.name}, ${user.email}, true, ${user.role}, ${memberId})
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
