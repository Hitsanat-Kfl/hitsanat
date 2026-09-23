"use client";

import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { Child, Member, SubDepartment } from "@/domains/definitions";

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

/** Shape of GET /api/v1/users/stats (GetUserStatsUseCase). */
export interface UserStats {
  total: number;
  active: number;
  deactivated: number;
  byRole: Record<string, number>;
}

/** Shape of GET /api/v1/system-metadata rows. */
export interface SystemMetadataRow {
  key: string;
  value: string;
  updatedAt: string;
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
  /** Authoritative lifecycle counts from GET /users/stats. */
  userStats: UserStats | null;
  /** Seed/migration metadata from GET /system-metadata. */
  systemMetadata: SystemMetadataRow[];
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

interface SuperAdminDashboardData {
  totalAccounts: number;
  activeAccounts: number;
  loadedAccounts: number;
  deactivatedAccounts: AdminUserRow[];
  recentAccounts: AdminUserRow[];
  roleCounts: RoleCount[];
  leadershipRoster: RosterEntry[];
  memberTotal: number | null;
  childrenTotal: number | null;
  subDepartmentCount: number;
  userNameById: Record<string, string>;
  health: ApiHealth | null;
  healthError: string | null;
  healthCheckedAt: string;
  membersError: boolean;
  childrenError: boolean;
  userStats: UserStats | null;
  systemMetadata: SystemMetadataRow[];
}

async function fetchSuperAdminDashboard(): Promise<SuperAdminDashboardData> {
  const [usersRes, statsRes, metadataRes, departmentsRes, healthRes, membersRes, childrenRes] =
    await Promise.allSettled([
      api.get<PaginatedResponse<AdminUserRow>>(`/users?limit=${USERS_PAGE_LIMIT}`),
      api.get<ApiResponse<UserStats>>("/users/stats"),
      api.get<ApiResponse<SystemMetadataRow[]>>("/system-metadata"),
      api.get<ApiResponse<SubDepartment[]>>("/sub-departments"),
      api.get<ApiHealth>("/health"),
      api.get<PaginatedResponse<Member>>("/members?limit=1"),
      api.get<PaginatedResponse<Child>>("/children?limit=1"),
    ]);

  // /users is the core dataset — without it the administrative sections
  // cannot render truthfully, so surface the error state.
  if (usersRes.status === "rejected") {
    throw usersRes.reason;
  }

  const users = usersRes.value.data ?? [];
  const pageTotal = usersRes.value.pagination?.total ?? users.length;
  const stats = statsRes.status === "fulfilled" ? statsRes.value.data : null;
  const metadata = metadataRes.status === "fulfilled" ? (metadataRes.value.data ?? []) : [];
  const departments =
    departmentsRes.status === "fulfilled" ? (departmentsRes.value.data ?? []) : [];
  // Lifecycle is driven by `status` (FR-13.6, migration 0006) — NOT by
  // emailVerified, which only tracks whether the email was confirmed.
  const active = users.filter((u) => u.status === "ACTIVE");
  const deactivated = users.filter((u) => u.status === "DEACTIVATED");
  const apiHealth = healthRes.status === "fulfilled" ? healthRes.value : null;

  const nameMap: Record<string, string> = {};
  for (const user of users) {
    nameMap[user.id] = user.name;
  }

  let roleCounts: RoleCount[];
  if (stats?.byRole) {
    roleCounts = Object.entries(stats.byRole)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count);
  } else {
    const counts = new Map<string, number>();
    for (const user of users) {
      counts.set(user.role, (counts.get(user.role) ?? 0) + 1);
    }
    roleCounts = [...counts.entries()]
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count);
  }

  return {
    // Prefer the authoritative stats endpoint for snapshot counts; fall back
    // to the loaded page when /users/stats is unavailable.
    totalAccounts: stats?.total ?? pageTotal,
    activeAccounts: stats?.active ?? active.length,
    loadedAccounts: users.length,
    subDepartmentCount: departments.length,
    userNameById: nameMap,
    deactivatedAccounts: deactivated,
    // API already returns users ordered by createdAt desc.
    recentAccounts: users.slice(0, 5),
    leadershipRoster: buildRoster(users),
    roleCounts,
    userStats: stats,
    systemMetadata: metadata,
    // Collection totals come from pagination.total (count queries), so a
    // single-row page fetch is enough. A failure shows "—", never a zero.
    memberTotal:
      membersRes.status === "fulfilled" ? (membersRes.value.pagination?.total ?? null) : null,
    childrenTotal:
      childrenRes.status === "fulfilled" ? (childrenRes.value.pagination?.total ?? null) : null,
    membersError: membersRes.status === "rejected",
    childrenError: childrenRes.status === "rejected",
    health: apiHealth,
    healthCheckedAt: new Date().toISOString(),
    healthError: healthRes.status === "rejected" ? messageOf(healthRes.reason) : null,
  };
}

/**
 * Super Admin dashboard data.
 *
 * Sources (all real endpoints — nothing fabricated):
 *  - GET /users?limit=100 (BR-008): rows for roster, recent, deactivated list.
 *  - GET /users/stats: authoritative total/active/deactivated/byRole counts.
 *  - GET /system-metadata: seed/migration status (FR-13.4).
 *  - GET /members?limit=1 & GET /children?limit=1: collection totals.
 *  - GET /sub-departments: configured programs.
 *  - GET /health: API service status/version/environment.
 */
export function useSuperAdminDashboard(): UseSuperAdminDashboardResult {
  const query = useQuery({
    queryKey: ["dashboard", "super-admin"],
    queryFn: fetchSuperAdminDashboard,
  });

  const data = query.data;
  const leadershipRoster = data?.leadershipRoster ?? [];

  return {
    totalAccounts: data?.totalAccounts ?? 0,
    activeAccounts: data?.activeAccounts ?? 0,
    loadedAccounts: data?.loadedAccounts ?? 0,
    deactivatedAccounts: data?.deactivatedAccounts ?? [],
    recentAccounts: data?.recentAccounts ?? [],
    roleCounts: data?.roleCounts ?? [],
    leadershipRoster,
    rosterConflicts: leadershipRoster.filter((e) => e.conflict),
    unassignedPosts: leadershipRoster.filter((e) => e.status === "UNASSIGNED"),
    memberTotal: data?.memberTotal ?? null,
    childrenTotal: data?.childrenTotal ?? null,
    subDepartmentCount: data?.subDepartmentCount ?? 0,
    userNameById: data?.userNameById ?? {},
    health: data?.health ?? null,
    healthError: data?.healthError ?? null,
    healthCheckedAt: data?.healthCheckedAt ?? null,
    membersError: data?.membersError ?? false,
    childrenError: data?.childrenError ?? false,
    userStats: data?.userStats ?? null,
    systemMetadata: data?.systemMetadata ?? [],
    quickActions: QUICK_ACTIONS,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Request failed") : null,
    refresh: () => {
      void query.refetch();
    },
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
