"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthUser } from "@/features/auth";
import { ChairpersonDashboardPage } from "./chairperson-dashboard-page";
import { ExecutiveDashboardPage } from "./executive-dashboard-page";
import { MezmurDashboardPage } from "./mezmur-dashboard";
import { SecretaryDashboardPage } from "./secretary-dashboard";
import { SubChairpersonDashboardPage } from "./sub-chairperson-dashboard";
import { SuperAdminDashboardPage } from "./super-admin-dashboard";

/** Sub-dept officer posts that grant admin-portal access (ADR-0007). */
const SUB_DEPT_ACCESS_ROLES = ["Leader", "Sub-Leader", "Secretary"];

function LoadingPane() {
  return (
    <div className="flex h-[50vh] items-center justify-center" aria-busy="true">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

/**
 * Role-aware home dashboard.
 *
 * Maps the resolved session roles to dashboards that actually exist:
 * - SUPER_ADMIN        → Super Admin dashboard (system administration)
 * - CHAIRPERSON        → Chairperson dashboard (ministry operations)
 * - SUB_CHAIRPERSON    → Vice-Chairperson dashboard (delegated oversight)
 * - SECRETARY          → Secretary dashboard (administrative operations)
 * - MEZMUR_LEADER      → Mezmur dashboard (choir & music ministry)
 * - Sub-dept officer   → redirected to /sub-departments/<code>/dashboard
 *
 * This is presentation-level routing only — the RouteGuard still owns
 * access control (ADR-0007).
 */
export function DashboardRouter() {
  const router = useRouter();
  const user = useAuthUser();

  const globalRoles = user?.globalRoles ?? [];
  const hasExecutiveRole =
    globalRoles.includes("SUPER_ADMIN") ||
    globalRoles.includes("CHAIRPERSON") ||
    globalRoles.includes("SUB_CHAIRPERSON") ||
    globalRoles.includes("SECRETARY") ||
    globalRoles.includes("MEZMUR_LEADER");

  // Sub-department officers have no executive dashboard — send them to
  // their department's own dashboard.
  useEffect(() => {
    if (!user || hasExecutiveRole) return;

    const assignment = user.subDeptRoles?.find((m) => SUB_DEPT_ACCESS_ROLES.includes(m.role));
    if (assignment?.subDepartmentCode) {
      router.replace(`/sub-departments/${assignment.subDepartmentCode}/dashboard`);
    }
  }, [user, hasExecutiveRole, router]);

  if (!user) {
    return <LoadingPane />;
  }

  if (globalRoles.includes("SUPER_ADMIN")) {
    return <SuperAdminDashboardPage />;
  }
  if (globalRoles.includes("CHAIRPERSON")) {
    return <ChairpersonDashboardPage />;
  }
  if (globalRoles.includes("SUB_CHAIRPERSON")) {
    return <SubChairpersonDashboardPage />;
  }
  if (globalRoles.includes("SECRETARY")) {
    return <SecretaryDashboardPage />;
  }
  if (globalRoles.includes("MEZMUR_LEADER")) {
    return <MezmurDashboardPage />;
  }

  // Sub-dept officers redirect via the effect above.
  return <LoadingPane />;
}
