// ============================================================
// Access control — single source of truth for admin-portal
// access decisions shared by the auth guard and the dashboard
// router (ADR-0007).
// ============================================================
// Roles are NOT application modules: they only decide which
// existing features/domains a user can access. The API remains
// the final authorization authority; these constants exist so
// the frontend never drifts between call sites.
// ============================================================

/** Global leadership roles that grant admin-portal access. */
export const LEADERSHIP_ROLES = [
  "SUPER_ADMIN",
  "CHAIRPERSON",
  "SUB_CHAIRPERSON",
  "SECRETARY",
] as const;

/** Executive roles that receive a role dashboard on the home page. */
export const EXECUTIVE_DASHBOARD_ROLES = [
  "SUPER_ADMIN",
  "CHAIRPERSON",
  "SUB_CHAIRPERSON",
  "SECRETARY",
  "MEZMUR_LEADER",
] as const;

/** Sub-department officer posts that grant admin-portal access (ADR-0007). */
export const SUB_DEPT_ACCESS_ROLES = ["Leader", "Sub-Leader", "Secretary"] as const;

export type LeadershipRole = (typeof LEADERSHIP_ROLES)[number];
export type ExecutiveDashboardRole = (typeof EXECUTIVE_DASHBOARD_ROLES)[number];

export function isLeadershipRole(role: string): role is LeadershipRole {
  return (LEADERSHIP_ROLES as readonly string[]).includes(role);
}

export function isExecutiveDashboardRole(role: string): role is ExecutiveDashboardRole {
  return (EXECUTIVE_DASHBOARD_ROLES as readonly string[]).includes(role);
}

export function hasGlobalLeadership(globalRoles: string[]): boolean {
  return globalRoles.some((role) => isLeadershipRole(role));
}

export function hasSubDeptLeadership(
  subDeptRoles: Array<{ subDepartmentCode: string; role: string }>
): boolean {
  return subDeptRoles.some((membership) =>
    (SUB_DEPT_ACCESS_ROLES as readonly string[]).includes(membership.role)
  );
}

/**
 * ADR-0007 portal-access decision: leadership role OR sub-department
 * officer post. Used by the RouteGuard to allow/deny the portal.
 */
export function hasPortalAccess(
  globalRoles: string[],
  subDeptRoles: Array<{ subDepartmentCode: string; role: string }>
): boolean {
  return hasGlobalLeadership(globalRoles) || hasSubDeptLeadership(subDeptRoles);
}

/**
 * Returns the sub-department dashboard route for an officer, if any.
 * Used by the dashboard router to redirect sub-dept officers who have
 * no executive dashboard.
 */
export function findSubDeptDashboardRoute(
  subDeptRoles: Array<{ subDepartmentCode: string; role: string }>
): string | undefined {
  const assignment = subDeptRoles.find((membership) =>
    (SUB_DEPT_ACCESS_ROLES as readonly string[]).includes(membership.role)
  );
  return assignment?.subDepartmentCode
    ? `/sub-departments/${assignment.subDepartmentCode}/dashboard`
    : undefined;
}
