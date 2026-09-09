import { ActionType, ResourceType, SubDepartmentCode } from "./types.js";
import type { Permission } from "./types.js";

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
