import type { CreateUserInput, UpdateUserInput } from "@repo/validation";

export type CreateUserWithMemberInput = Omit<CreateUserInput, "memberId"> & {
  memberId: string | null;
};

export interface UserWithSubDepartments {
  id: string;
  name: string;
  email: string;
  role: string;
  memberId: string | null;
  emailVerified: boolean;
  /** Lifecycle status: ACTIVE or DEACTIVATED (FR-13.6). */
  status: "ACTIVE" | "DEACTIVATED";
  /** When the account was deactivated (null while active). */
  deactivatedAt: Date | null;
  image: string | null;
  subDepartments: Array<{
    subDepartmentId: string;
    code: string;
    nameEn: string;
    role: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Repository contract for user account management (BR-008).
 * Accounts are created/updated for leadership roles only,
 * each linked to a registered member (BR-007).
 */
export interface UserRepository {
  findById(id: string): Promise<UserWithSubDepartments | null>;
  findByEmail(email: string): Promise<UserWithSubDepartments | null>;
  list(params: { page?: number; limit?: number; search?: string; role?: string }): Promise<{
    users: UserWithSubDepartments[];
    total: number;
  }>;
  /**
   * Persists the local user row linked to a Supabase auth user id.
   * `memberId` must be non-null for leadership roles (BR-007, also DB-enforced).
   */
  create(authUserId: string, data: CreateUserWithMemberInput): Promise<UserWithSubDepartments>;
  update(id: string, data: UpdateUserInput): Promise<UserWithSubDepartments>;
  /**
   * Replace the user's sub-department assignments on the linked member
   * (BR-002: a member may belong to multiple sub-departments).
   */
  setSubDepartments(memberId: string, subDepartmentIds: string[]): Promise<void>;
  /**
   * Read the member's current sub-department membership rows
   * (used for BR-009 one-leadership-post validation).
   */
  getMemberships(
    memberId: string
  ): Promise<Array<{ subDepartmentCode: string; subDepartmentId: string; role: string }>>;
  /**
   * Map sub-department ids to their codes (for BR-009 error messages).
   */
  getSubDepartmentCodes(ids: string[]): Promise<Map<string, string>>;
  setEmailVerified(id: string, verified: boolean): Promise<void>;
  /**
   * PE-06 / FR-13.11: count active executive accounts (SUPER_ADMIN or
   * CHAIRPERSON) for the last-admin guard rail.
   */
  countActiveExecutives(): Promise<number>;
  /**
   * PE-01 / FR-13.6: mark the account ACTIVE (Supabase unban happens in
   * the auth adapter). Returns the updated row.
   */
  setStatus(
    id: string,
    status: "ACTIVE" | "DEACTIVATED",
    deactivatedAt: Date | null
  ): Promise<void>;
}
