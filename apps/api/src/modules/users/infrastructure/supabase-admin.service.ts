import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseAdminService } from "../application/use-cases/user.use-cases.js";

/**
 * Real Supabase Auth admin adapter (BR-008).
 *
 * Uses the service-role key, which bypasses RLS and has full authority over
 * Supabase Auth users. This key must NEVER leave the server side.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in the environment. All methods throw
 * a descriptive error at call time if it is missing, so a misconfigured
 * deployment fails loudly instead of silently skipping provisioning.
 */
class SupabaseAdminServiceUnavailableError extends Error {
  constructor(operation: string) {
    super(
      `Cannot ${operation}: SUPABASE_SERVICE_ROLE_KEY is not configured. Set it in the API environment to enable leadership account provisioning (BR-008).`
    );
    this.name = "SupabaseAdminServiceUnavailableError";
  }
}

function getAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("SUPABASE_URL is not configured");
  }
  if (!serviceRoleKey) {
    throw new SupabaseAdminServiceUnavailableError("initialize Supabase admin client");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Extract a human-readable message from a Supabase Auth error.
 */
function supabaseErrorMessage(error: { message?: string; status?: number } | null): string {
  if (!error) return "Unknown Supabase Auth error";
  return error.message ?? `Supabase Auth error (status ${error.status ?? "unknown"})`;
}

/**
 * Lazily-created shared admin client (per process).
 */
let adminClient: SupabaseClient | null = null;

function sharedAdminClient(): SupabaseClient {
  if (!adminClient) {
    adminClient = getAdminClient();
  }
  return adminClient;
}

export class SupabaseAdminAuthService implements SupabaseAdminService {
  async createUser(input: {
    email: string;
    password: string;
    name: string;
    role: string;
  }): Promise<{ authUserId: string }> {
    const supabase = sharedAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        name: input.name,
        role: input.role,
      },
    });

    if (error) {
      throw new Error(`Supabase Auth account creation failed: ${supabaseErrorMessage(error)}`);
    }

    return { authUserId: data.user.id };
  }

  async updatePassword(authUserId: string, newPassword: string): Promise<void> {
    const supabase = sharedAdminClient();

    const { error } = await supabase.auth.admin.updateUserById(authUserId, {
      password: newPassword,
    });

    if (error) {
      throw new Error(`Supabase Auth password reset failed: ${supabaseErrorMessage(error)}`);
    }
  }

  async updateEmail(authUserId: string, newEmail: string): Promise<void> {
    const supabase = sharedAdminClient();

    const { error } = await supabase.auth.admin.updateUserById(authUserId, {
      email: newEmail,
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Supabase Auth email update failed: ${supabaseErrorMessage(error)}`);
    }
  }

  async deactivate(authUserId: string): Promise<void> {
    const supabase = sharedAdminClient();

    const { error } = await supabase.auth.admin.updateUserById(authUserId, {
      ban_duration: "876000h", // ~100 years; Supabase has no permanent ban — use a very long one
      user_metadata: { deactivated: true },
    });

    if (error) {
      throw new Error(`Supabase Auth deactivation failed: ${supabaseErrorMessage(error)}`);
    }
  }
}

export { SupabaseAdminServiceUnavailableError };
