import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@repo/database";
import * as schema from "@repo/database/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any = null;

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verificationTokens,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days rolling
      updateAge: 60 * 60 * 24, // Update every 24 hours
      cookie: {
        name: "better-auth.session_token",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "MEMBER_REGULAR",
        },
      },
    },
  });
}

export function getAuth() {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth as ReturnType<typeof betterAuth>;
}

export { getAuth as auth };
