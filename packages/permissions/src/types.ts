export enum GlobalRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  CHAIRPERSON = "CHAIRPERSON",
  SUB_CHAIRPERSON = "SUB_CHAIRPERSON",
  SECRETARY = "SECRETARY",
}

export enum ResourceType {
  MEMBERS = "members",
  FAMILIES = "families",
  CHILDREN = "children",
  PARENTS = "parents",
  SUB_DEPARTMENTS = "sub_departments",
  ATTENDANCE = "attendance",
  ACADEMIC = "academic",
  PLANNING = "planning",
  EVENTS = "events",
  REPORTS = "reports",
  ANNOUNCEMENTS = "announcements",
}

export enum ActionType {
  CREATE = "C",
  READ = "R",
  UPDATE = "U",
  DELETE = "D",
  APPROVE = "A",
}

export enum SubDepartmentCode {
  TIMIHRT = "TIMIHRT",
  MEZMUR = "MEZMUR",
  KUTITR = "KUTITR",
  EKD = "EKD",
  KINETIBEB = "KINETIBEB",
}

export interface Permission {
  resource: ResourceType;
  action: ActionType;
  subDepartmentScope?: SubDepartmentCode;
}

export interface UserSession {
  userId: string;
  email: string;
  role: GlobalRole;
  subDepartmentRole?: "Leader" | "Sub-Leader" | "Secretary" | "Member";
  subDepartmentCode?: SubDepartmentCode;
}

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
