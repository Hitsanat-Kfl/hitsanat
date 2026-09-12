import type { Session, User } from "@repo/database/schema";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string | null;
  globalRoles: string[];
  subDeptRoles: Array<{
    subDepartmentCode: string;
    role: string;
  }>;
}

export interface AuthContext {
  user: User;
  session: Session;
  sessionUser: SessionUser;
}
