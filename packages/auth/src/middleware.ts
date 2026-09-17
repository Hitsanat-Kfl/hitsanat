// Re-export all auth utilities from main entry for backward compatibility.
// Existing imports from "@repo/auth/middleware" continue to work.
export {
  extractToken,
  getSupabase,
  requireAuth,
  requireScopePermission,
  resolveUserScopes,
  verifySupabaseToken,
} from "./index.js";
export type { RequireScopePermissionOptions } from "./index.js";
