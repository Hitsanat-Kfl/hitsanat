/**
 * Shared Permissions Package Interface
 * Role-Based Access Control (RBAC) system for the application
 */

import { ActionType, GlobalRole, ResourceType, SubDepartmentCode } from "./types.js";
import type { Permission } from "./types.js";

// Permission matrix configuration
export const PERMISSION_MATRIX: Record<GlobalRole, Permission[]> = {
  [GlobalRole.SUPER_ADMIN]: [
    { resource: ResourceType.MEMBERS, action: ActionType.CREATE },
    { resource: ResourceType.MEMBERS, action: ActionType.READ },
    { resource: ResourceType.MEMBERS, action: ActionType.UPDATE },
    { resource: ResourceType.MEMBERS, action: ActionType.DELETE },
    { resource: ResourceType.FAMILIES, action: ActionType.CREATE },
    { resource: ResourceType.FAMILIES, action: ActionType.READ },
    { resource: ResourceType.FAMILIES, action: ActionType.UPDATE },
    { resource: ResourceType.FAMILIES, action: ActionType.DELETE },
    { resource: ResourceType.CHILDREN, action: ActionType.CREATE },
    { resource: ResourceType.CHILDREN, action: ActionType.READ },
    { resource: ResourceType.CHILDREN, action: ActionType.UPDATE },
    { resource: ResourceType.CHILDREN, action: ActionType.DELETE },
    { resource: ResourceType.PARENTS, action: ActionType.CREATE },
    { resource: ResourceType.PARENTS, action: ActionType.READ },
    { resource: ResourceType.PARENTS, action: ActionType.UPDATE },
    { resource: ResourceType.PARENTS, action: ActionType.DELETE },
    { resource: ResourceType.SUB_DEPARTMENTS, action: ActionType.CREATE },
    { resource: ResourceType.SUB_DEPARTMENTS, action: ActionType.READ },
    { resource: ResourceType.SUB_DEPARTMENTS, action: ActionType.UPDATE },
    { resource: ResourceType.SUB_DEPARTMENTS, action: ActionType.DELETE },
    { resource: ResourceType.ATTENDANCE, action: ActionType.CREATE },
    { resource: ResourceType.ATTENDANCE, action: ActionType.READ },
    { resource: ResourceType.ATTENDANCE, action: ActionType.UPDATE },
    { resource: ResourceType.ATTENDANCE, action: ActionType.DELETE },
    { resource: ResourceType.ACADEMIC, action: ActionType.CREATE },
    { resource: ResourceType.ACADEMIC, action: ActionType.READ },
    { resource: ResourceType.ACADEMIC, action: ActionType.UPDATE },
    { resource: ResourceType.ACADEMIC, action: ActionType.DELETE },
    { resource: ResourceType.PLANNING, action: ActionType.CREATE },
    { resource: ResourceType.PLANNING, action: ActionType.READ },
    { resource: ResourceType.PLANNING, action: ActionType.UPDATE },
    { resource: ResourceType.PLANNING, action: ActionType.DELETE },
    { resource: ResourceType.EVENTS, action: ActionType.CREATE },
    { resource: ResourceType.EVENTS, action: ActionType.READ },
    { resource: ResourceType.EVENTS, action: ActionType.UPDATE },
    { resource: ResourceType.EVENTS, action: ActionType.DELETE },
    { resource: ResourceType.REPORTS, action: ActionType.CREATE },
    { resource: ResourceType.REPORTS, action: ActionType.READ },
    { resource: ResourceType.REPORTS, action: ActionType.UPDATE },
    { resource: ResourceType.REPORTS, action: ActionType.DELETE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.CREATE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.READ },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.UPDATE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.DELETE },
  ],
  [GlobalRole.CHAIRPERSON]: [
    { resource: ResourceType.MEMBERS, action: ActionType.CREATE },
    { resource: ResourceType.MEMBERS, action: ActionType.READ },
    { resource: ResourceType.MEMBERS, action: ActionType.UPDATE },
    { resource: ResourceType.MEMBERS, action: ActionType.DELETE },
    { resource: ResourceType.FAMILIES, action: ActionType.CREATE },
    { resource: ResourceType.FAMILIES, action: ActionType.READ },
    { resource: ResourceType.FAMILIES, action: ActionType.UPDATE },
    { resource: ResourceType.FAMILIES, action: ActionType.DELETE },
    { resource: ResourceType.CHILDREN, action: ActionType.CREATE },
    { resource: ResourceType.CHILDREN, action: ActionType.READ },
    { resource: ResourceType.CHILDREN, action: ActionType.UPDATE },
    { resource: ResourceType.CHILDREN, action: ActionType.DELETE },
    { resource: ResourceType.PARENTS, action: ActionType.CREATE },
    { resource: ResourceType.PARENTS, action: ActionType.READ },
    { resource: ResourceType.PARENTS, action: ActionType.UPDATE },
    { resource: ResourceType.PARENTS, action: ActionType.DELETE },
    { resource: ResourceType.PLANNING, action: ActionType.CREATE },
    { resource: ResourceType.PLANNING, action: ActionType.READ },
    { resource: ResourceType.PLANNING, action: ActionType.UPDATE },
    { resource: ResourceType.PLANNING, action: ActionType.DELETE },
    { resource: ResourceType.PLANNING, action: ActionType.APPROVE },
    { resource: ResourceType.EVENTS, action: ActionType.CREATE },
    { resource: ResourceType.EVENTS, action: ActionType.READ },
    { resource: ResourceType.EVENTS, action: ActionType.UPDATE },
    { resource: ResourceType.EVENTS, action: ActionType.DELETE },
    { resource: ResourceType.EVENTS, action: ActionType.APPROVE },
    { resource: ResourceType.REPORTS, action: ActionType.CREATE },
    { resource: ResourceType.REPORTS, action: ActionType.READ },
    { resource: ResourceType.REPORTS, action: ActionType.UPDATE },
    { resource: ResourceType.REPORTS, action: ActionType.DELETE },
    { resource: ResourceType.REPORTS, action: ActionType.APPROVE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.CREATE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.READ },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.UPDATE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.DELETE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.APPROVE },
  ],
  [GlobalRole.SUB_CHAIRPERSON]: [
    { resource: ResourceType.MEMBERS, action: ActionType.CREATE },
    { resource: ResourceType.MEMBERS, action: ActionType.READ },
    { resource: ResourceType.MEMBERS, action: ActionType.UPDATE },
    { resource: ResourceType.MEMBERS, action: ActionType.DELETE },
    { resource: ResourceType.FAMILIES, action: ActionType.CREATE },
    { resource: ResourceType.FAMILIES, action: ActionType.READ },
    { resource: ResourceType.FAMILIES, action: ActionType.UPDATE },
    { resource: ResourceType.FAMILIES, action: ActionType.DELETE },
    { resource: ResourceType.CHILDREN, action: ActionType.CREATE },
    { resource: ResourceType.CHILDREN, action: ActionType.READ },
    { resource: ResourceType.CHILDREN, action: ActionType.UPDATE },
    { resource: ResourceType.CHILDREN, action: ActionType.DELETE },
    { resource: ResourceType.PARENTS, action: ActionType.CREATE },
    { resource: ResourceType.PARENTS, action: ActionType.READ },
    { resource: ResourceType.PARENTS, action: ActionType.UPDATE },
    { resource: ResourceType.PARENTS, action: ActionType.DELETE },
    { resource: ResourceType.PLANNING, action: ActionType.CREATE },
    { resource: ResourceType.PLANNING, action: ActionType.READ },
    { resource: ResourceType.PLANNING, action: ActionType.UPDATE },
    { resource: ResourceType.PLANNING, action: ActionType.DELETE },
    { resource: ResourceType.PLANNING, action: ActionType.APPROVE },
    { resource: ResourceType.EVENTS, action: ActionType.CREATE },
    { resource: ResourceType.EVENTS, action: ActionType.READ },
    { resource: ResourceType.EVENTS, action: ActionType.UPDATE },
    { resource: ResourceType.EVENTS, action: ActionType.DELETE },
    { resource: ResourceType.EVENTS, action: ActionType.APPROVE },
    { resource: ResourceType.REPORTS, action: ActionType.CREATE },
    { resource: ResourceType.REPORTS, action: ActionType.READ },
    { resource: ResourceType.REPORTS, action: ActionType.UPDATE },
    { resource: ResourceType.REPORTS, action: ActionType.DELETE },
    { resource: ResourceType.REPORTS, action: ActionType.APPROVE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.CREATE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.READ },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.UPDATE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.DELETE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.APPROVE },
  ],
  [GlobalRole.SECRETARY]: [
    { resource: ResourceType.MEMBERS, action: ActionType.CREATE },
    { resource: ResourceType.MEMBERS, action: ActionType.READ },
    { resource: ResourceType.MEMBERS, action: ActionType.UPDATE },
    { resource: ResourceType.MEMBERS, action: ActionType.DELETE },
    { resource: ResourceType.FAMILIES, action: ActionType.CREATE },
    { resource: ResourceType.FAMILIES, action: ActionType.READ },
    { resource: ResourceType.FAMILIES, action: ActionType.UPDATE },
    { resource: ResourceType.FAMILIES, action: ActionType.DELETE },
    { resource: ResourceType.CHILDREN, action: ActionType.CREATE },
    { resource: ResourceType.CHILDREN, action: ActionType.READ },
    { resource: ResourceType.CHILDREN, action: ActionType.UPDATE },
    { resource: ResourceType.CHILDREN, action: ActionType.DELETE },
    { resource: ResourceType.PARENTS, action: ActionType.CREATE },
    { resource: ResourceType.PARENTS, action: ActionType.READ },
    { resource: ResourceType.PARENTS, action: ActionType.UPDATE },
    { resource: ResourceType.PARENTS, action: ActionType.DELETE },
    { resource: ResourceType.ATTENDANCE, action: ActionType.READ },
    { resource: ResourceType.ACADEMIC, action: ActionType.READ },
    { resource: ResourceType.PLANNING, action: ActionType.READ },
    { resource: ResourceType.EVENTS, action: ActionType.READ },
    { resource: ResourceType.REPORTS, action: ActionType.READ },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.CREATE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.READ },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.UPDATE },
    { resource: ResourceType.ANNOUNCEMENTS, action: ActionType.DELETE },
  ],
};

// Sub-department specific permissions
export const SUB_DEPT_PERMISSIONS: Record<SubDepartmentCode, Permission[]> = {
  [SubDepartmentCode.TIMIHRT]: [
    {
      resource: ResourceType.ACADEMIC,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.TIMIHRT,
    },
    {
      resource: ResourceType.ACADEMIC,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.TIMIHRT,
    },
    {
      resource: ResourceType.ACADEMIC,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.TIMIHRT,
    },
    {
      resource: ResourceType.ACADEMIC,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.TIMIHRT,
    },
  ],
  [SubDepartmentCode.MEZMUR]: [
    {
      resource: ResourceType.EVENTS,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.MEZMUR,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.MEZMUR,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.MEZMUR,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.MEZMUR,
    },
  ],
  [SubDepartmentCode.KUTITR]: [
    {
      resource: ResourceType.ATTENDANCE,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
    {
      resource: ResourceType.ATTENDANCE,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
    {
      resource: ResourceType.ATTENDANCE,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
    {
      resource: ResourceType.ATTENDANCE,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
    {
      resource: ResourceType.CHILDREN,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
    {
      resource: ResourceType.CHILDREN,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
    {
      resource: ResourceType.CHILDREN,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
    {
      resource: ResourceType.CHILDREN,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
    {
      resource: ResourceType.PARENTS,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.KUTITR,
    },
  ],
  [SubDepartmentCode.EKD]: [
    {
      resource: ResourceType.PLANNING,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.PLANNING,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.PLANNING,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.PLANNING,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.REPORTS,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.REPORTS,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.REPORTS,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.REPORTS,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.REPORTS,
      action: ActionType.APPROVE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.ANNOUNCEMENTS,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.ANNOUNCEMENTS,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.ANNOUNCEMENTS,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
    {
      resource: ResourceType.ANNOUNCEMENTS,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.EKD,
    },
  ],
  [SubDepartmentCode.KINETIBEB]: [
    {
      resource: ResourceType.EVENTS,
      action: ActionType.CREATE,
      subDepartmentScope: SubDepartmentCode.KINETIBEB,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.READ,
      subDepartmentScope: SubDepartmentCode.KINETIBEB,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.UPDATE,
      subDepartmentScope: SubDepartmentCode.KINETIBEB,
    },
    {
      resource: ResourceType.EVENTS,
      action: ActionType.DELETE,
      subDepartmentScope: SubDepartmentCode.KINETIBEB,
    },
  ],
};

// Permission checking functions
export function hasGlobalPermission(
  role: GlobalRole,
  resource: ResourceType,
  action: ActionType
): boolean {
  const permissions = PERMISSION_MATRIX[role];
  return permissions.some((p) => p.resource === resource && p.action === action);
}

export function hasSubDeptPermission(
  role: GlobalRole,
  subDeptRole: "Leader" | "Sub-Leader" | "Secretary" | "Member",
  subDeptCode: SubDepartmentCode,
  resource: ResourceType,
  action: ActionType
): boolean {
  // Global roles have full access
  if (
    role === GlobalRole.SUPER_ADMIN ||
    role === GlobalRole.CHAIRPERSON ||
    role === GlobalRole.SUB_CHAIRPERSON
  ) {
    return true;
  }

  // Secretary has read access to most resources
  if (role === GlobalRole.SECRETARY) {
    if (action === ActionType.READ) {
      return true;
    }
  }

  // Sub-department leaders have full access to their department's resources
  if (subDeptRole === "Leader" || subDeptRole === "Sub-Leader") {
    const subDeptPermissions = SUB_DEPT_PERMISSIONS[subDeptCode];
    return subDeptPermissions.some((p) => p.resource === resource && p.action === action);
  }

  // Sub-department secretaries have create/read/update access
  if (subDeptRole === "Secretary") {
    const subDeptPermissions = SUB_DEPT_PERMISSIONS[subDeptCode];
    return subDeptPermissions.some(
      (p) =>
        p.resource === resource &&
        (p.action === ActionType.CREATE ||
          p.action === ActionType.READ ||
          p.action === ActionType.UPDATE)
    );
  }

  // Regular members have no admin access
  return false;
}

export function checkPermission(
  userRole: GlobalRole,
  subDeptRole: "Leader" | "Sub-Leader" | "Secretary" | "Member" | null,
  subDeptCode: SubDepartmentCode | null,
  resource: ResourceType,
  action: ActionType
): boolean {
  // Check global permissions first
  if (hasGlobalPermission(userRole, resource, action)) {
    return true;
  }

  // Check sub-department permissions
  if (subDeptRole && subDeptCode) {
    return hasSubDeptPermission(userRole, subDeptRole, subDeptCode, resource, action);
  }

  return false;
}

// User session type
export interface UserSession {
  userId: string;
  email: string;
  role: GlobalRole;
  subDepartmentRole?: "Leader" | "Sub-Leader" | "Secretary" | "Member";
  subDepartmentCode?: SubDepartmentCode;
}

// Permission middleware types
export interface PermissionContext {
  user: UserSession;
  resource: ResourceType;
  action: ActionType;
  subDepartmentScope?: SubDepartmentCode;
}

export type PermissionCheckResult = {
  allowed: boolean;
  reason?: string;
};
