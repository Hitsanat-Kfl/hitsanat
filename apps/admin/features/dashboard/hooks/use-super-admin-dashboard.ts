"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, type PaginatedResponse, api } from "@/lib/api-client";
import type { Child, Member, SubDepartment } from "@/lib/types";

/**
 * Mirror of the API's UserWithSubDepartments (users module contract).
 * Shape verified against DrizzleUserRepository.hydrate().
 */
export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  memberId: string | null;
  emailVerified: boolean;
  /** Lifecycle status: ACTIVE or DEACTIVATED (FR-13.6, migration 0006). */
  status: "ACTIVE" | "DEACTIVATED";
  deactivatedAt: string | null;
  subDepartments: Array<{
    subDepartmentId: string;
    code: string;
    nameEn: string;
    role: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/** Shape of GET /api/v1/health (health.router.ts). */
export interface ApiHealth {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  environment: string;
}

export interface RoleCount {
  role: string;
  count: number;
}

/**
 * Leadership Roster entry: one row per post (executive global roles plus
 * sub-department Leader posts). Posts with no active holder are emitted
 * as unassigned entries so the roster shows the full leadership picture.
 */
export interface RosterEntry {
  userId: string;
  name: string;
  email: string | null;
  /** Display-ready post labels, e.g. "Secretary" or "TIMIHRT Leader". */
  posts: string[];
  /** Sub-department code the post belongs to, when departmental. */
  department: string | null;
  /** BR-009: the member holds more than one leadership post. */
  conflict: boolean;
  status: "ACTIVE" | "DEACTIVATED" | "UNASSIGNED";
}

/** Icon keys the dashboard resolves to Lucide components (serializable). */
export type QuickActionIconKey =
  | "users"
  | "audit-logs"
  | "permissions"
  | "members"
  | "children"
  | "sub-departments";

export interface SuperAdminQuickAction {
  id: string;
  title: string;
  description: string;
  /** Existing application route (no invented routes). */
  href: string;
  icon: QuickActionIconKey;
}

const EXECUTIVE_ROLES = new Set(["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"]);
const SUB_DEPT_LEADERSHIP_ROLES = new Set(["Leader"]);

/** Human-readable labels for executive roles in the roster Post column. */
const EXECUTIVE_ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  CHAIRPERSON: "Chairperson",
  SUB_CHAIRPERSON: "Sub-Chairperson",
  SECRETARY: "Secretary",
};

/**
 * Canonical sub-department codes (lib/types.ts SubDeptCode). Used to emit
 * unassigned roster rows for departmental posts nobody currently holds.
 */
const CANONICAL_SUB_DEPT_CODES = ["TIMIHRT", "MEZMUR", "KUTITR", "EKD", "KINETIBEB"] as const;

function isLeadershipSubDeptRole(role: string): boolean {
  return SUB_DEPT_LEADERSHIP_ROLES.has(role);
}

/**
 * Builds the leadership roster from user rows. Executive global roles and
 * sub-department Leader memberships count as posts; anything more than one
 * post per member is a BR-009 conflict. Canonical departmental posts with
 * no active holder are appended as unassigned rows.
 */
function buildRoster(users: AdminUserRow[]): RosterEntry[] {
  const entries: RosterEntry[] = [];
  const heldDepartmentalPosts = new Set<string>();

  for (const user of users) {
    const posts: string[] = [];
    let department: string | null = null;
    if (EXECUTIVE_ROLES.has(user.role)) {
      posts.push(EXECUTIVE_ROLE_LABELS[user.role] ?? user.role);
    }
    for (const sd of user.subDepartments) {
      if (isLeadershipSubDeptRole(sd.role)) {
        posts.push(`${sd.code} Leader`);
        department = department ?? sd.code;
        if (user.status === "ACTIVE") heldDepartmentalPosts.add(sd.code);
      }
    }
    if (posts.length === 0) continue;
    entries.push({
      userId: user.id,
      name: user.name,
      email: user.email,
      posts,
      department,
      conflict: posts.length > 1,
      status: user.status,
    });
  }

  // Unassigned posts: canonical departmental leadership with no ACTIVE holder.
  for (const code of CANONICAL_SUB_DEPT_CODES) {
    if (!heldDepartmentalPosts.has(code)) {
      entries.push({
        userId: `unassigned-${code.toLowerCase()}`,
        name: "—",
        email: null,
        posts: [`${code} Leader`],
        department: code,
        conflict: false,
        status: "UNASSIGNED",
      });
    }
  }

  return entries.sort(
    (a, b) =>
      Number(b.conflict) - Number(a.conflict) ||
      Number(a.status === "UNASSIGNED") - Number(b.status === "UNASSIGNED") ||
      a.posts.join(",").localeCompare(b.posts.join(","))
  );
}

export interface UseSuperAdminDashboardResult {
  /** pagination.total from GET /users — every provisioned account. */
  totalAccounts: number;
  /** Accounts with lifecycle status ACTIVE (within the loaded page). */
  activeAccounts: number;
  /** Accounts actually loaded (the users endpoint caps at 100). */
  loadedAccounts: number;
  deactivatedAccounts: AdminUserRow[];
  /** Last 5 provisioned accounts (API returns createdAt desc). */
  recentAccounts: AdminUserRow[];
  roleCounts: RoleCount[];
  leadershipRoster: RosterEntry[];
  /** BR-009 conflict rows in the roster. */
  rosterConflicts: RosterEntry[];
  /** Unassigned leadership posts (UNASSIGNED roster rows). */
  unassignedPosts: RosterEntry[];
  /** pagination.total from GET /members — all registered members. */
  memberTotal: number | null;
  /** pagination.total from GET /children — all registered children. */
  childrenTotal: number | null;
  subDepartmentCount: number;
  /** user id → display name, for resolving audit-log actors. */
  userNameById: Record<string, string>;
  health: ApiHealth | null;
  healthError: string | null;
  /** When the health check last settled (ISO), for "Last checked · X min ago". */
  healthCheckedAt: string | null;
  /** True when /members could not be loaded — snapshot shows "—". */
  membersError: boolean;
  /** True when /children could not be loaded — snapshot shows "—". */
  childrenError: boolean;
  quickActions: SuperAdminQuickAction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** The users endpoint caps limit at 100 (DrizzleUserRepository.list). */
const USERS_PAGE_LIMIT = 100;

function messageOf(err: unknown): string {
  if (err && typeof err === "object" && "title" in err) {
    return String((err as { title: unknown }).title);
  }
  if (err instanceof Error) return err.message;
  return "Request failed";
}

/**
 * Super Admin dashboard data.
 *
 * Sources (all real endpoints — nothing fabricated):
 *  - GET /users (BR-008, SUPER_ADMIN/CHAIRPERSON only): accounts, roles,
 *    lifecycle status, sub-department assignments.
 *  - GET /members?limit=1 & GET /children?limit=1: collection totals
 *    (pagination.total only — no rows are pulled).
 *  - GET /sub-departments: configured programs.
 *  - GET /health: API service status/version/environment.
 */
export function useSuperAdminDashboard(): UseSuperAdminDashboardResult {
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [activeAccounts, setActiveAccounts] = useState(0);
  const [loadedAccounts, setLoadedAccounts] = useState(0);
  const [deactivatedAccounts, setDeactivatedAccounts] = useState<AdminUserRow[]>([]);
  const [recentAccounts, setRecentAccounts] = useState<AdminUserRow[]>([]);
  const [roleCounts, setRoleCounts] = useState<RoleCount[]>([]);
  const [leadershipRoster, setLeadershipRoster] = useState<RosterEntry[]>([]);
  const [memberTotal, setMemberTotal] = useState<number | null>(null);
  const [childrenTotal, setChildrenTotal] = useState<number | null>(null);
  const [subDepartmentCount, setSubDepartmentCount] = useState(0);
  const [userNameById, setUserNameById] = useState<Record<string, string>>({});
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [healthCheckedAt, setHealthCheckedAt] = useState<string | null>(null);
  const [membersError, setMembersError] = useState(false);
  const [childrenError, setChildrenError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHealthError(null);
    setHealthCheckedAt(null);
    setMembersError(false);
    setChildrenError(false);

    const [usersRes, departmentsRes, healthRes, membersRes, childrenRes] = await Promise.allSettled(
      [
        api.get<PaginatedResponse<AdminUserRow>>(`/users?limit=${USERS_PAGE_LIMIT}`),
        api.get<ApiResponse<SubDepartment[]>>("/sub-departments"),
        api.get<ApiHealth>("/health"),
        api.get<PaginatedResponse<Member>>("/members?limit=1"),
        api.get<PaginatedResponse<Child>>("/children?limit=1"),
      ]
    );

    // /users is the core dataset — without it the administrative sections
    // cannot render truthfully, so surface the error state.
    if (usersRes.status === "rejected") {
      setError(messageOf(usersRes.reason));
      setLoading(false);
      return;
    }

    const users = usersRes.value.data ?? [];
    const total = usersRes.value.pagination?.total ?? users.length;
    const departments =
      departmentsRes.status === "fulfilled" ? (departmentsRes.value.data ?? []) : [];
    // Lifecycle is driven by `status` (FR-13.6, migration 0006) — NOT by
    // emailVerified, which only tracks whether the email was confirmed.
    const active = users.filter((u) => u.status === "ACTIVE");
    const deactivated = users.filter((u) => u.status === "DEACTIVATED");
    const apiHealth = healthRes.status === "fulfilled" ? healthRes.value : null;

    setTotalAccounts(total);
    setActiveAccounts(active.length);
    setLoadedAccounts(users.length);
    setSubDepartmentCount(departments.length);
    const nameMap: Record<string, string> = {};
    for (const user of users) {
      nameMap[user.id] = user.name;
    }
    setUserNameById(nameMap);
    setDeactivatedAccounts(deactivated);
    // API already returns users ordered by createdAt desc.
    setRecentAccounts(users.slice(0, 5));
    setLeadershipRoster(buildRoster(users));

    const counts = new Map<string, number>();
    for (const user of users) {
      counts.set(user.role, (counts.get(user.role) ?? 0) + 1);
    }
    setRoleCounts(
      [...counts.entries()]
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count)
    );

    // Collection totals come from pagination.total (count queries), so a
    // single-row page fetch is enough. A failure shows "—", never a zero.
    if (membersRes.status === "fulfilled") {
      setMemberTotal(membersRes.value.pagination?.total ?? null);
    } else {
      setMembersError(true);
    }
    if (childrenRes.status === "fulfilled") {
      setChildrenTotal(childrenRes.value.pagination?.total ?? null);
    } else {
      setChildrenError(true);
    }

    setHealth(apiHealth);
    setHealthCheckedAt(new Date().toISOString());
    if (healthRes.status === "rejected") {
      setHealthError(messageOf(healthRes.reason));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    totalAccounts,
    activeAccounts,
    loadedAccounts,
    deactivatedAccounts,
    recentAccounts,
    roleCounts,
    leadershipRoster,
    rosterConflicts: leadershipRoster.filter((e) => e.conflict),
    unassignedPosts: leadershipRoster.filter((e) => e.status === "UNASSIGNED"),
    memberTotal,
    childrenTotal,
    subDepartmentCount,
    userNameById,
    health,
    healthError,
    healthCheckedAt,
    membersError,
    childrenError,
    quickActions: QUICK_ACTIONS,
    loading,
    error,
    refresh: fetchData,
  };
}

/** Quick actions target existing application routes only. */
const QUICK_ACTIONS: SuperAdminQuickAction[] = [
  {
    id: "qa-users",
    title: "User Accounts",
    description: "Manage accounts",
    href: "/users",
    icon: "users",
  },
  {
    id: "qa-members",
    title: "Members",
    description: "Member records",
    href: "/members",
    icon: "members",
  },
  {
    id: "qa-children",
    title: "Children",
    description: "Children records",
    href: "/children",
    icon: "children",
  },
  {
    id: "qa-sub-departments",
    title: "Sub-Departments",
    description: "Configure programs",
    href: "/sub-departments",
    icon: "sub-departments",
  },
  {
    id: "qa-permissions",
    title: "Roles & Permissions",
    description: "Review role access",
    href: "/permissions",
    icon: "permissions",
  },
  {
    id: "qa-audit-logs",
    title: "Audit Logs",
    description: "View system activity",
    href: "/audit-logs",
    icon: "audit-logs",
  },
];
