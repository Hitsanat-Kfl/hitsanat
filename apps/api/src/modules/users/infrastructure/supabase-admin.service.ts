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

  /**
   * PE-01 / FR-13.6: lift the ban placed by deactivate() and clear the
   * deactivation metadata so the user can sign in again.
   */
  async reactivate(authUserId: string): Promise<void> {
    const supabase = sharedAdminClient();

    const { error } = await supabase.auth.admin.updateUserById(authUserId, {
      ban_duration: "none",
      user_metadata: { deactivated: false },
    });

    if (error) {
      throw new Error(`Supabase Auth reactivation failed: ${supabaseErrorMessage(error)}`);
    }
  }

  /**
   * PE-08 / FR-13.13: revoke every live session for the user (force
   * sign-out), independent of account deactivation.
   *
   * `auth.admin.signOut` expects a session JWT, not a user UUID — calling it
   * with the UUID always fails. Prefer GoTrue's admin logout endpoint
   * (POST /admin/users/:id/logout), which invalidates all refresh tokens for
   * the user. Fall back to a short ban + unban cycle, which also kicks
   * existing sessions when the platform does not expose the logout route.
   */
  async revokeSessions(authUserId: string): Promise<void> {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      throw new SupabaseAdminServiceUnavailableError("revoke user sessions");
    }

    const logoutUrl = `${url.replace(/\/$/, "")}/auth/v1/admin/users/${authUserId}/logout`;
    let logoutOk = false;
    try {
      const response = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
      });
      // 200/204 = revoked; 404 = route unavailable on this GoTrue build → fallback
      logoutOk = response.ok || response.status === 204;
      if (!logoutOk && response.status !== 404 && response.status !== 405) {
        const body = await response.text().catch(() => "");
        throw new Error(
          `Supabase Auth session revocation failed (HTTP ${response.status})${body ? `: ${body}` : ""}`
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Supabase Auth session revocation")) {
        throw error;
      }
      // Network/parse failure → try ban/unban fallback below
      logoutOk = false;
    }

    if (logoutOk) return;

    // Fallback: momentary ban forces re-authentication (invalidates sessions
    // on refresh paths that reject banned users), then immediately lift it.
    const supabase = sharedAdminClient();
    const ban = await supabase.auth.admin.updateUserById(authUserId, {
      ban_duration: "10s",
    });
    if (ban.error) {
      throw new Error(
        `Supabase Auth session revocation failed: ${supabaseErrorMessage(ban.error)}`
      );
    }
    const unban = await supabase.auth.admin.updateUserById(authUserId, {
      ban_duration: "none",
    });
    if (unban.error) {
      throw new Error(
        `Supabase Auth session revocation failed while clearing ban: ${supabaseErrorMessage(unban.error)}`
      );
    }
  }
}

export { SupabaseAdminServiceUnavailableError };
