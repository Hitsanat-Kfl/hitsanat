/**
 * BR-007 backfill: leadership accounts created before migration 0003 have no
 * member link, which violates `users_leadership_requires_member_check`. This
 * script creates a placeholder member for each unlinked leadership account
 * (same logic as the users seed) and links it.
 *
 * Idempotent: users that already have a member_id are skipped.
 */
import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const client = postgres(connectionString, { max: 1 });

// Ensure the member_id column exists — migration 0003 (which adds it) may not
// have applied yet, and the backfill must run BEFORE it so the BR-007 check
// constraint can be created without violations.
await client`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS member_id uuid`;

const leadershipRoles = ["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"];

const unlinked = await client`
  SELECT id, name, email, role FROM public.users
  WHERE role IN ${client(leadershipRoles)} AND member_id IS NULL
`;

console.log(`Leadership accounts without member link: ${unlinked.length}`);

for (const user of unlinked as unknown as Array<{
  id: string;
  name: string;
  email: string;
  role: string;
}>) {
  // Reuse an existing member matched by the placeholder phone number first
  // (idempotency across re-runs), otherwise create one.
  const phone = `SEED-${user.email}`;
  const existing = await client`
    SELECT id FROM public.members WHERE phone_number = ${phone} LIMIT 1
  `;

  let memberId: string;
  if (existing.length > 0) {
    memberId = (existing[0] as { id: string }).id;
    console.log(`  Reusing member for ${user.email}`);
  } else {
    const created = await client`
      INSERT INTO public.members
        (full_name, christian_name, phone_number, year_of_study, academic_department, campus, gender)
      VALUES
        (${user.name}, ${user.name}, ${phone}, 'GC', 'Leadership', 'Main Campus', 'Male')
      RETURNING id
    `;
    memberId = (created[0] as { id: string }).id;
    console.log(`  Created placeholder member for ${user.email} (${user.role})`);
  }

  await client`
    UPDATE public.users SET member_id = ${memberId} WHERE id = ${user.id}
  `;
}

console.log("\nBackfill complete. Re-run `pnpm db:migrate` to apply migration 0003.");
await client.end();
