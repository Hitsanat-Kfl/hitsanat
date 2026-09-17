/**
 * Post-migration verification: BR-007 links + BR-009 trigger behavior.
 * The trigger test runs inside a rolled-back transaction (no data changes).
 */
import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const client = postgres(connectionString, { max: 1 });

// 1. BR-007: every user's member link status
const users = await client`
  SELECT u.email, u.role, u.member_id IS NOT NULL AS linked
  FROM public.users u ORDER BY u.role
`;
console.log("BR-007 member links:");
for (const u of users as unknown as Array<{ email: string; role: string; linked: boolean }>) {
  console.log(`  ${u.email} (${u.role}): ${u.linked ? "linked" : "NOT LINKED"}`);
}

// 2. BR-009 trigger test: giving an executive a sub-dept Leader row must fail
const sd = await client`SELECT id, code FROM public.sub_departments LIMIT 1`;
const subDeptId = (sd[0] as { id: string }).id;
const exec = await client`
  SELECT member_id FROM public.users WHERE role = 'CHAIRPERSON' AND member_id IS NOT NULL LIMIT 1
`;
const execMemberId = (exec[0] as { member_id: string }).member_id;

const sb = await client
  .begin(async (tx) => {
    let insertRejected = false;
    try {
      await tx`
      INSERT INTO public.sub_department_members (member_id, sub_department_id, role, is_primary)
      VALUES (${execMemberId}, ${subDeptId}, 'Leader', false)
    `;
    } catch (e) {
      insertRejected = (e as Error).message.includes("BR-009");
      if (!insertRejected) throw e;
    }
    console.log(
      `\nBR-009 trigger: executive + sub-dept Leader rejected: ${insertRejected ? "YES ✓" : "NO ✗"}`
    );
    throw new postgres.TransactionRollback(""); // rollback test data
  })
  .catch(() => {});

void sb;

await client.end();
console.log("\nVerification complete.");
