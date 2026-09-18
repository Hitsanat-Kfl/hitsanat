/**
 * Verifies SUPABASE_SERVICE_ROLE_KEY works: calls Supabase Auth admin
 * listUsers. Output is masked — never prints the key or user secrets.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(`Missing env: url=${url ? "set" : "MISSING"}, key=${key ? "set" : "MISSING"}`);
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 10 });

if (error) {
  console.error(`❌ Key rejected: ${error.message}`);
  process.exit(1);
}

console.log("✅ Service-role key VALID — admin API access confirmed.");
console.log(`   Auth users in project: ${data.users.length}+ (page 1)`);
for (const u of data.users) {
  console.log(`   - ${u.email ?? u.id} (created ${u.created_at?.slice(0, 10) ?? "?"})`);
}
