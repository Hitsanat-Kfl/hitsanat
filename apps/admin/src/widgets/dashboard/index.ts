export * from "@/config/dashboard";
export { useDashboard } from "./hooks/use-dashboard";
export { useChairpersonDashboard } from "./hooks/use-chairperson-dashboard";
export { useSuperAdminDashboard } from "./hooks/use-super-admin-dashboard";
export { useAuditLogs } from "./hooks/use-audit-logs";
export { SuperAdminDashboardPage } from "./components/super-admin-dashboard";
export { ChairpersonDashboardPage } from "./components/chairperson-dashboard-page";
export { ExecutiveDashboardPage } from "./components/executive-dashboard-page";
export { SubChairpersonDashboardPage } from "./components/sub-chairperson-dashboard";
export { SecretaryDashboardPage } from "./components/secretary-dashboard";
export { MezmurDashboardPage } from "./components/mezmur-dashboard";
export { DashboardRouter } from "./components/dashboard-router";
export {
  useSubChairpersonDashboard,
  departmentDrillDownHref,
} from "./hooks/use-sub-chairperson-dashboard";
export { useSecretaryDashboard } from "./hooks/use-secretary-dashboard";
export { useMezmurDashboard } from "./hooks/use-mezmur-dashboard";
export type {
  DepartmentStatus,
  ReviewItem,
  UseSubChairpersonDashboardResult,
} from "./hooks/use-sub-chairperson-dashboard";
export type {
  IncompleteRecordItem,
  UseSecretaryDashboardResult,
} from "./hooks/use-secretary-dashboard";
export type { UseMezmurDashboardResult } from "./hooks/use-mezmur-dashboard";
export type { AuditEntry } from "./hooks/use-audit-logs";
export type {
  AdminUserRow,
  ApiHealth,
  RoleCount,
  UseSuperAdminDashboardResult,
} from "./hooks/use-super-admin-dashboard";
