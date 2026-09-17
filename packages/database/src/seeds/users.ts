import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../../.env") });
dotenv.config({ path: resolve(__dirname, "../../.env") });
dotenv.config();

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgrespassword@localhost:5432/hitsanat_dev";
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  console.error("You can find the service role key in Supabase Dashboard > Settings > API");
  process.exit(1);
}

// Supabase admin client (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ─── Test users for each role ────────────────────────────────────────────────
// BR-007: every leadership account MUST be linked to a registered member.
// Members are matched by email; if a matching member does not exist yet,
// one is created first so the leadership account has a valid member link.
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
    // Regular members do not need dashboard access (ADR-0007/BR-021);
    // no member link is required for MEMBER_REGULAR accounts.
    name: "Regular Member",
    email: "member@hitsanat.org",
    password: "password123",
    role: "MEMBER_REGULAR",
  },
];

/**
 * Ensure a member row exists for the given leader (BR-007).
 * Matches on phone_number derived from email, falling back to email
 * lookup via telegram-less full-name matching is unreliable, so we
 * create a deterministic placeholder member per leader account.
 */
async function ensureLeaderMember(
  db: ReturnType<typeof drizzle>,
  user: { name: string; email: string; role: string }
): Promise<string> {
  // Reuse an existing linked member if one is already assigned
  const existingLink = await db.execute(sql`
    SELECT member_id FROM users WHERE email = ${user.email} AND member_id IS NOT NULL LIMIT 1
  `);
  const linked = (existingLink as unknown as Array<{ member_id: string }>)[0];
  if (linked) return linked.member_id;

  // Match a member by their full name
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

    // BR-009: a member who already holds a sub-dept leadership post elsewhere
    // cannot receive an executive role (or a second leadership post).
    const conflicts = await db.execute(sql`
      SELECT sd.code, sdm.role FROM sub_department_members sdm
      JOIN sub_departments sd ON sd.id = sdm.sub_department_id
      WHERE sdm.member_id = ${memberRow.id} AND sdm.role IN ('Leader', 'Sub-Leader')
      LIMIT 1
    `);
    const conflict = (conflicts as unknown as Array<{ code: string; role: string }>)[0];
    if (conflict) {
      throw new Error(
        `BR-009 violation: member "${user.name}" already holds ${conflict.role} of ${conflict.code} — cannot also be ${user.role}`
      );
    }

    return memberRow.id;
  }

  // Create a placeholder member so the leadership account is valid (BR-007)
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

async function seed() {
  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log("Seeding users via Supabase Auth...\n");

  for (const user of users) {
    let authUserId: string | undefined;

    // Create or update user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        role: user.role,
      },
    });

    if (authError) {
      // Find existing user and update password & metadata
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingUser = listData?.users.find((u) => u.email === user.email);
      if (existingUser) {
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            password: user.password,
            email_confirm: true,
            user_metadata: {
              name: user.name,
              role: user.role,
            },
          }
        );
        if (updateError) {
          console.error(`  Error updating user ${user.email}:`, updateError.message);
          continue;
        }
        authUserId = updateData.user.id;
        console.log(`  Updated: ${user.email} (${user.role}) / password: ${user.password}`);
      } else {
        console.error(`  Error creating auth user ${user.email}:`, authError.message);
        continue;
      }
    } else {
      authUserId = authData.user.id;
      console.log(`  Created: ${user.email} (${user.role}) / password: ${user.password}`);
    }

    // BR-007: leadership accounts must have a member link
    const leadershipRoles = ["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"];
    const memberId = leadershipRoles.includes(user.role)
      ? await ensureLeaderMember(db, user)
      : null;

    // Insert corresponding row in our users table
    await db.execute(sql`
      INSERT INTO users (id, name, email, email_verified, role, member_id)
      VALUES (${authUserId}, ${user.name}, ${user.email}, true, ${user.role}, ${memberId})
      ON CONFLICT (email) DO UPDATE SET
        id = ${authUserId},
        name = ${user.name},
        role = ${user.role},
        member_id = ${memberId},
        updated_at = NOW()
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
