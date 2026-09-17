import { GlobalRole, type SubDepartmentCode } from "./types.js";

/**
 * BR-009 — One Leadership Post Rule
 *
 * A member may hold at most ONE leadership position in the organization:
 * - At most one executive role (SUPER_ADMIN, CHAIRPERSON, SUB_CHAIRPERSON, SECRETARY)
 * - XOR at most one sub-department leadership post (Leader or Sub-Leader in
 *   exactly one sub-department)
 *
 * Always allowed regardless of leadership:
 * - Any number of sub-department `Member` rows (ordinary membership, BR-002)
 * - Any number of sub-department `Secretary` rows (records role, not leadership)
 * - Leadership + plain Member rows coexisting (executive oversight + membership)
 */

/** Roles considered "executive leadership" (ministry level). */
export const EXECUTIVE_ROLES: readonly string[] = [
  GlobalRole.SUPER_ADMIN,
  GlobalRole.CHAIRPERSON,
  GlobalRole.SUB_CHAIRPERSON,
  GlobalRole.SECRETARY,
];

/** Sub-department roles considered "leadership" (officer posts). */
export const LEADERSHIP_SUB_DEPT_ROLES: readonly string[] = ["Leader", "Sub-Leader"];

export interface MembershipRow {
  subDepartmentCode: SubDepartmentCode | string;
  role: string;
}

export interface LeadershipConflict {
  readonly allowed: false;
  readonly reason: string;
  readonly rule: "BR-009";
}

export interface LeadershipOk {
  readonly allowed: true;
}

export type LeadershipCheckResult = LeadershipConflict | LeadershipOk;

function isExecutiveRole(role: string | null | undefined): boolean {
  return role !== null && role !== undefined && EXECUTIVE_ROLES.includes(role);
}

function isSubDeptLeadership(role: string): boolean {
  return LEADERSHIP_SUB_DEPT_ROLES.includes(role);
}

/**
 * Validate a proposed leadership configuration against BR-009.
 *
 * @param params.executiveRole      The user's global role (existing or proposed). Null for MEMBER_REGULAR.
 * @param params.existingMemberships  Member's current sub_department_members rows.
 * @param params.proposedMemberships  Rows being added/kept (full desired final state if provided).
 * @param params.mode               "assign" evaluates the union of existing + proposed;
 *                                  "replace" evaluates proposed as the complete final state.
 */
export function checkLeadershipExclusivity(params: {
  executiveRole: string | null | undefined;
  existingMemberships: MembershipRow[];
  proposedMemberships: MembershipRow[];
  mode?: "assign" | "replace";
}): LeadershipCheckResult {
  const { executiveRole, existingMemberships, proposedMemberships } = params;
  const mode = params.mode ?? "assign";

  const finalMemberships: MembershipRow[] =
    mode === "replace"
      ? [...proposedMemberships]
      : [...existingMemberships, ...proposedMemberships];

  // 1. Executive role excludes any sub-dept leadership post.
  if (isExecutiveRole(executiveRole)) {
    const conflict = finalMemberships.find((m) => isSubDeptLeadership(m.role));
    if (conflict) {
      return {
        allowed: false,
        rule: "BR-009",
        reason: `Executive role ${executiveRole} cannot be combined with sub-department leadership (${conflict.role} of ${conflict.subDepartmentCode}). A member may hold only one leadership post.`,
      };
    }
  }

  // 2. At most one sub-dept leadership post across all departments.
  const leadershipPosts = finalMemberships.filter((m) => isSubDeptLeadership(m.role));
  if (leadershipPosts.length > 1) {
    const codes = leadershipPosts.map((m) => m.subDepartmentCode).join(", ");
    return {
      allowed: false,
      rule: "BR-009",
      reason: `Member cannot hold leadership in multiple sub-departments (${codes}). Only one Leader/Sub-Leader post is permitted.`,
    };
  }

  // 3. Same (department, role) duplicates for leadership posts are also a conflict
  //    (covered by length > 1, but kept explicit for identical-department dupes).
  const seen = new Set<string>();
  for (const post of leadershipPosts) {
    const key = `${post.subDepartmentCode}:${post.role}`;
    if (seen.has(key)) {
      return {
        allowed: false,
        rule: "BR-009",
        reason: `Duplicate leadership post ${post.role} of ${post.subDepartmentCode} is not allowed.`,
      };
    }
    seen.add(key);
  }

  return { allowed: true };
}

/**
 * Determine whether an update that changes a user's global role is permitted
 * given their existing sub-department memberships (BR-009 direction 1).
 */
export function checkRoleChangeAgainstMemberships(params: {
  newRole: string;
  existingMemberships: MembershipRow[];
}): LeadershipCheckResult {
  return checkLeadershipExclusivity({
    executiveRole: params.newRole,
    existingMemberships: params.existingMemberships,
    proposedMemberships: [],
  });
}
