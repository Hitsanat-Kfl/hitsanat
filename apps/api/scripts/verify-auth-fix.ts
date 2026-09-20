/**
 * Temporary verification (lives inside apps/api for dependency resolution):
 * does extractToken correctly pull the JWT out of the exact @supabase/ssr
 * cookie shape, and does verifySupabaseToken accept it?
 */
import { createClient } from "@supabase/supabase-js";
import { config as dotenv } from "dotenv";

// Load the API's .env so SUPABASE_URL / ANON_KEY are available standalone.
dotenv({ path: new URL("../../.env", import.meta.url).pathname });
dotenv();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("SUPABASE_URL / SUPABASE_ANON_KEY missing");
  process.exit(1);
}

async function main() {
  // 1. Real login to obtain a live session.
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "superadmin@hitsanat.org",
    password: "password123",
  });
  if (error || !data.session) {
    console.error("login failed:", error?.message);
    process.exit(1);
  }
  const realJwt = data.session.access_token;
  console.log("live JWT obtained, length:", realJwt.length);

  // 2. Build the exact @supabase/ssr cookie value.
  const sessionDocument = JSON.stringify({
    access_token: realJwt,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: data.session.refresh_token,
    user: { id: data.session.user.id },
  });
  const encoded = encodeURIComponent(sessionDocument);
  const cookieHeader = `sb-dsteofgntxayabgwcxmb-auth-token=${encoded}`;
  console.log("cookie header length:", cookieHeader.length);

  // 3. extractToken on that cookie.
  const { extractToken } = await import("../../packages/auth/src/index.js");
  const extracted = extractToken({ headers: { cookie: cookieHeader } } as never);
  console.log("extracted === real JWT:", extracted === realJwt);

  // 4. Chunked variant.
  const half = Math.ceil(encoded.length / 2);
  const chunkedCookie = `sb-dsteofgntxayabgwcxmb-auth-token.0=${encoded.slice(0, half)}; sb-dsteofgntxayabgwcxmb-auth-token.1=${encoded.slice(half)}`;
  const extractedChunked = extractToken({ headers: { cookie: chunkedCookie } } as never);
  console.log("chunked extraction === real JWT:", extractedChunked === realJwt);

  // 5. Server-side verification of the extracted token.
  const { verifySupabaseToken } = await import("../../packages/auth/src/index.js");
  const user = extracted ? await verifySupabaseToken(extracted) : null;
  console.log("verifySupabaseToken resolved user:", user ? user.email : "null → would 401");
}

main();
