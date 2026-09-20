"use client";

import { useCallback, useEffect, useState } from "react";
import type { KPIData, QuickAction, StatusSummaryItem } from "@repo/ui";
import { type ApiResponse, type PaginatedResponse, api } from "@/lib/api-client";
import type { SubDepartment } from "@/lib/types";

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
 * Leadership Roster Matrix entry (dashboards.md § 1.3): every leadership
 * post in the system — executive roles plus sub-department Leader /
 * Sub-Leader posts — with BR-009 conflict detection.
 */
export interface RosterEntry {
  userId: string;
  name: string;
  email: string;
  posts: string[];
  /** BR-009: the member holds more than one leadership post. */
  conflict: boolean;
  status: "ACTIVE" | "DEACTIVATED";
}

const EXECUTIVE_ROLES = new Set(["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"]);
const SUB_DEPT_LEADERSHIP_ROLES = new Set(["Leader", "Sub-Leader"]);

function isLeadershipSubDeptRole(role: string): boolean {
  return SUB_DEPT_LEADERSHIP_ROLES.has(role);
}

/**
 * Builds the leadership roster from user rows. Executive global roles and
 * sub-department Leader/Sub-Leader memberships count as posts; anything
 * more than one post per member is a BR-009 conflict.
 */
function buildRoster(users: AdminUserRow[]): RosterEntry[] {
  const entries: RosterEntry[] = [];
  for (const user of users) {
    const posts: string[] = [];
    if (EXECUTIVE_ROLES.has(user.role)) {
      posts.push(`${user.role} (global)`);
    }
    for (const sd of user.subDepartments) {
      if (isLeadershipSubDeptRole(sd.role)) {
        posts.push(`${sd.role} — ${sd.code}`);
      }
    }
    if (posts.length === 0) continue;
    entries.push({
      userId: user.id,
      name: user.name,
      email: user.email,
      posts,
      conflict: posts.length > 1,
      status: user.status,
    });
  }
  return entries.sort(
    (a, b) => Number(b.conflict) - Number(a.conflict) || a.name.localeCompare(b.name)
  );
}

export interface UseSuperAdminDashboardResult {
  kpis: KPIData[];
  deactivatedAccounts: AdminUserRow[];
  verificationSummary: StatusSummaryItem[];
  recentAccounts: AdminUserRow[];
  roleCounts: RoleCount[];
  leadershipRoster: RosterEntry[];
  health: ApiHealth | null;
  healthError: string | null;
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** The users endpoint caps limit at 100 (ListUsersUseCase). */
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
 *    verification status, sub-department assignments.
 *  - GET /sub-departments: configured programs.
 *  - GET /health: API service status/version/environment.
 *
 * There is no audit-log domain yet, so no activity/audit section is produced.
 */
export function useSuperAdminDashboard(): UseSuperAdminDashboardResult {
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [deactivatedAccounts, setDeactivatedAccounts] = useState<AdminUserRow[]>([]);
  const [verificationSummary, setVerificationSummary] = useState<StatusSummaryItem[]>([]);
  const [recentAccounts, setRecentAccounts] = useState<AdminUserRow[]>([]);
  const [roleCounts, setRoleCounts] = useState<RoleCount[]>([]);
  const [leadershipRoster, setLeadershipRoster] = useState<RosterEntry[]>([]);
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [quickActions] = useState<QuickAction[]>([
    {
      id: "qa-users",
      label: "Manage Users",
      onClick: () => window.location.assign("/users"),
      variant: "outline",
    },
    {
      id: "qa-audit-logs",
      label: "Audit Logs",
      onClick: () => window.location.assign("/audit-logs"),
      variant: "outline",
    },
    {
      id: "qa-permissions",
      label: "Permissions",
      onClick: () => window.location.assign("/permissions"),
      variant: "outline",
    },
    {
      id: "qa-members",
      label: "Manage Members",
      onClick: () => window.location.assign("/members"),
      variant: "outline",
    },
    {
      id: "qa-subdepartments",
      label: "Sub-Departments",
      onClick: () => window.location.assign("/sub-departments"),
      variant: "outline",
    },
    {
      id: "qa-reports",
      label: "View Reports",
      onClick: () => window.location.assign("/reports"),
      variant: "outline",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHealthError(null);

    const [usersRes, departmentsRes, healthRes] = await Promise.allSettled([
      api.get<PaginatedResponse<AdminUserRow>>(`/users?limit=${USERS_PAGE_LIMIT}`),
      api.get<ApiResponse<SubDepartment[]>>("/sub-departments"),
      api.get<ApiHealth>("/health"),
    ]);

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

    setKpis([
      {
        label: "User Accounts",
        value: total,
        description: "All provisioned accounts",
      },
      {
        label: "Active Accounts",
        value: active.length,
        description:
          users.length < total ? `Status ACTIVE (of ${users.length} loaded)` : "Status ACTIVE",
      },
      {
        label: "Sub-Departments",
        value: departments.length,
        description: "Configured programs",
      },
      {
        label: "API Service",
        value: apiHealth ? "Healthy" : "Unreachable",
        status: apiHealth ? "success" : "destructive",
        description: apiHealth
          ? `v${apiHealth.version} · ${apiHealth.environment}`
          : "Health endpoint not responding",
      },
    ]);

    setDeactivatedAccounts(deactivated);

    setVerificationSummary([
      { status: "active", label: "Active accounts", count: active.length },
      { status: "inactive", label: "Deactivated accounts", count: deactivated.length },
    ]);

    setLeadershipRoster(buildRoster(users));

    // API already returns users ordered by createdAt desc.
    setRecentAccounts(users.slice(0, 5));

    const counts = new Map<string, number>();
    for (const user of users) {
      counts.set(user.role, (counts.get(user.role) ?? 0) + 1);
    }
    setRoleCounts(
      [...counts.entries()]
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count)
    );

    setHealth(apiHealth);
    if (healthRes.status === "rejected") {
      setHealthError(messageOf(healthRes.reason));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    kpis,
    deactivatedAccounts,
    verificationSummary,
    recentAccounts,
    roleCounts,
    leadershipRoster,
    health,
    healthError,
    quickActions,
    loading,
    error,
    refresh: fetchData,
  };
}
