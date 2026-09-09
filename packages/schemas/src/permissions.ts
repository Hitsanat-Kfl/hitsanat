// Re-export all permissions from the new package for backward compatibility
export {
  GlobalRole,
  ResourceType,
  ActionType,
  SubDepartmentCode,
  type Permission,
  type UserSession,
  type PermissionContext,
  type PermissionCheckResult,
  PERMISSION_MATRIX,
  SUB_DEPT_PERMISSIONS,
  hasGlobalPermission,
  hasSubDeptPermission,
  checkPermission,
} from "@repo/permissions";
