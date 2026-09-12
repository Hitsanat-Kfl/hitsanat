import { PERMISSION_MATRIX } from "./matrix.js";
import { SUB_DEPT_PERMISSIONS } from "./sub-dept-permissions.js";
import { ActionType, GlobalRole, type ResourceType, type SubDepartmentCode } from "./types.js";

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
  if (
    role === GlobalRole.SUPER_ADMIN ||
    role === GlobalRole.CHAIRPERSON ||
    role === GlobalRole.SUB_CHAIRPERSON
  ) {
    return true;
  }

  if (role === GlobalRole.SECRETARY) {
    if (action === ActionType.READ) {
      return true;
    }
  }

  if (subDeptRole === "Leader" || subDeptRole === "Sub-Leader") {
    const subDeptPermissions = SUB_DEPT_PERMISSIONS[subDeptCode];
    return subDeptPermissions.some((p) => p.resource === resource && p.action === action);
  }

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

  return false;
}

export function checkPermission(
  userRole: GlobalRole,
  subDeptRole: "Leader" | "Sub-Leader" | "Secretary" | "Member" | null,
  subDeptCode: SubDepartmentCode | null,
  resource: ResourceType,
  action: ActionType
): boolean {
  if (hasGlobalPermission(userRole, resource, action)) {
    return true;
  }

  if (subDeptRole && subDeptCode) {
    return hasSubDeptPermission(userRole, subDeptRole, subDeptCode, resource, action);
  }

  return false;
}
