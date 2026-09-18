export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  /** Linked member record (BR-007) — null only for MEMBER_REGULAR legacy rows. */
  memberId: string | null;
  image?: string | null;
  globalRoles: string[];
  subDeptRoles: Array<{
    subDepartmentCode: string;
    role: string;
  }>;
}
