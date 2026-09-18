/**
 * E2E provisioning test (BR-008/BR-009 live verification).
 * Requires the API running on :3001 and SUPABASE_SERVICE_ROLE_KEY in env.
 *
 * Flow:
 *  1. Sign in as seeded super admin (anon client) to get a JWT
 *  2. GET /users → 200 with seeded accounts
 *  3. BR-009 via API: POST /users granting SECRETARY on a member that already
 *     holds a sub-dept Leader row → expect 409 LEADERSHIP_CONFLICT
 *  4. POST /users → real Supabase Auth account + local mirror
 *  5. Reset password → verify sign-in with the NEW password works
 *  6. Deactivate → verify sign-in is rejected (banned)
 *  7. 403: MEMBER_REGULAR token must not access /users
 *  8. Cleanup: delete test auth user, local rows, and test member
 *
 * Never prints secrets — tokens and keys stay in memory.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

const API = process.env.API_BASE_URL ?? "http://localhost:3001/api/v1";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

const SUPABASE_URL = requireEnv("SUPABASE_URL");
const ANON_KEY = requireEnv("SUPABASE_ANON_KEY");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DB_URL = requireEnv("DATABASE_URL");

const anon = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const db = postgres(DB_URL, { max: 1 });

let failures = 0;
function check(label: string, ok: boolean, detail = "") {
  const mark = ok ? "✓" : "✗";
  console.log(`${mark} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

async function main() {
  // 1. Sign in as super admin
  const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({
    email: "superadmin@hitsanat.org",
    password: "password123",
  });
  check("Super admin sign-in", !signInErr && !!signIn.session, signInErr?.message);
  if (!signIn?.session) {
    console.error("Cannot continue without an admin session.");
    process.exit(1);
  }
  const adminToken = signIn.session.access_token;

  const authHeaders = { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" };

  // 2. List users
  const listRes = await fetch(`${API}/users`, { headers: authHeaders });
  const listJson = (await listRes.json()) as { data?: unknown[] };
  check("GET /users → 200", listRes.status === 200, `status=${listRes.status}`);
  check(
    "Seeded users visible",
    (listJson.data?.length ?? 0) >= 5,
    `count=${listJson.data?.length}`
  );

  // 3. BR-009 via API: member already holding sub-dept Leader cannot get SECRETARY
  const sd = await db`SELECT id, code FROM public.sub_departments LIMIT 1`;
  const subDeptId = (sd[0] as { id: string; code: string }).id;
  const testMember = await db`
    INSERT INTO public.members (full_name, christian_name, phone_number, year_of_study, academic_department, campus, gender)
    VALUES ('E2E Conflict Member', 'E2E', 'E2E-CONFLICT-001', 'GC', 'Testing', 'Main Campus', 'Male')
    RETURNING id
  `;
  const memberId = (testMember[0] as { id: string }).id;
  await db`
    INSERT INTO public.sub_department_members (member_id, sub_department_id, role, is_primary)
    VALUES (${memberId}, ${subDeptId}, 'Leader', false)
  `;
  console.log(`   (created test member with Leader row in ${(sd[0] as { code: string }).code})`);

  const conflictRes = await fetch(`${API}/users`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "E2E Conflict User",
      email: "e2e-conflict@hitsanat.org",
      password: "ConflictPass1!",
      role: "SECRETARY",
      memberId,
    }),
  });
  const conflictJson = (await conflictRes.json()) as { error?: { code?: string } };
  check(
    "BR-009: SECRETARY on Leader-holding member → 409",
    conflictRes.status === 409 && conflictJson.error?.code === "LEADERSHIP_CONFLICT",
    `status=${conflictRes.status} code=${conflictJson.error?.code}`
  );

  // 4. Create a real account (MEMBER_REGULAR, no member link needed)
  const newEmail = "e2e-test-leader@hitsanat.org";
  const createRes = await fetch(`${API}/users`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "E2E Test Leader",
      email: newEmail,
      password: "TestPass123!",
      role: "MEMBER_REGULAR",
    }),
  });
  const createJson = (await createRes.json()) as { data?: { id: string } };
  check("POST /users → 201", createRes.status === 201, `status=${createRes.status}`);
  const newUserId = createJson.data?.id;

  const authUser = await admin.auth.admin.listUsers();
  const createdAuth = authUser.data.users.find((u) => u.email === newEmail);
  check(
    "Supabase Auth account actually created",
    !!createdAuth,
    createdAuth ? `auth id matches local id: ${createdAuth.id === newUserId}` : "missing"
  );
  check("Local id = Supabase auth id", createdAuth?.id === newUserId);

  // 5. Reset password, then prove the new password works
  const resetRes = await fetch(`${API}/users/${newUserId}/reset-password`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ newPassword: "NewPass456!" }),
  });
  check("POST /:id/reset-password → 200", resetRes.status === 200, `status=${resetRes.status}`);

  const { error: newPassErr } = await anon.auth.signInWithPassword({
    email: newEmail,
    password: "NewPass456!",
  });
  check("Sign-in with RESET password works", !newPassErr, newPassErr?.message);

  // 6. Deactivate → sign-in blocked
  const deactRes = await fetch(`${API}/users/${newUserId}/deactivate`, {
    method: "POST",
    headers: authHeaders,
  });
  check("POST /:id/deactivate → 200", deactRes.status === 200, `status=${deactRes.status}`);

  const { error: bannedErr } = await anon.auth.signInWithPassword({
    email: newEmail,
    password: "NewPass456!",
  });
  check("Deactivated account cannot sign in", !!bannedErr, bannedErr?.message.slice(0, 60));

  // 7. MEMBER_REGULAR cannot access /users
  const { data: regSignIn } = await anon.auth.signInWithPassword({
    email: "member@hitsanat.org",
    password: "password123",
  });
  const regToken = regSignIn?.session?.access_token;
  check("MEMBER_REGULAR sign-in", !!regToken);
  if (!regToken) {
    console.error("Cannot continue without a member session.");
    process.exit(1);
  }
  const regRes = await fetch(`${API}/users`, {
    headers: { Authorization: `Bearer ${regToken}` },
  });
  check("MEMBER_REGULAR GET /users → 403", regRes.status === 403, `status=${regRes.status}`);

  // 8. Cleanup (Supabase auth user + local rows + test member)
  if (createdAuth) await admin.auth.admin.deleteUser(createdAuth.id);
  if (newUserId) await db`DELETE FROM public.users WHERE id = ${newUserId}`;
  await db`DELETE FROM public.sub_department_members WHERE member_id = ${memberId}`;
  await db`DELETE FROM public.members WHERE id = ${memberId}`;
  console.log("\nCleanup done (test auth user, local rows, test member removed).");

  await db.end();
  console.log(failures === 0 ? "\n🎉 ALL E2E CHECKS PASSED" : `\n💥 ${failures} check(s) failed`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("E2E error:", e);
  await db.end();
  process.exit(1);
});
