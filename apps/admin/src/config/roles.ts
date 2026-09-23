import type { DashboardRole } from "@repo/ui";

// ============================================================
// Single source of truth for admin user roles.
// nav-config (navigation) and dashboard config (widgets) both
// derive their role unions from this type.
// ============================================================
export type AdminRole = DashboardRole;

export const ADMIN_ROLES = [
  "chairperson",
  "sub-chairperson",
  "secretary",
  "timihrt-leader",
  "mezmur-leader",
  "kutitr-leader",
  "ekd-leader",
  "kinetibeb-leader",
  "super-admin",
] as const satisfies readonly AdminRole[];
