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

export interface UseSuperAdminDashboardResult {
  kpis: KPIData[];
  deactivatedAccounts: AdminUserRow[];
  verificationSummary: StatusSummaryItem[];
  recentAccounts: AdminUserRow[];
  roleCounts: RoleCount[];
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
    const verified = users.filter((u) => u.emailVerified);
    const deactivated = users.filter((u) => !u.emailVerified);
    const apiHealth = healthRes.status === "fulfilled" ? healthRes.value : null;

    setKpis([
      {
        label: "User Accounts",
        value: total,
        description: "All provisioned accounts",
      },
      {
        label: "Active Accounts",
        value: verified.length,
        description:
          users.length < total ? `Verified email (of ${users.length} loaded)` : "Email verified",
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
      { status: "active", label: "Active accounts", count: verified.length },
      { status: "inactive", label: "Deactivated accounts", count: deactivated.length },
    ]);

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
    health,
    healthError,
    quickActions,
    loading,
    error,
    refresh: fetchData,
  };
}
