import { checkLeadershipExclusivity, type MembershipRow } from "@repo/permissions";
import type { CreateUserInput, UpdateUserInput } from "@repo/validation";
import {
  LeaderMustBeMemberError,
  LeadershipConflictError,
  type MemberNotFoundError,
  UserAccountExistsError,
  UserNotFoundError,
} from "../../domain/errors/user.error.js";
import type {
  UserRepository,
  UserWithSubDepartments,
} from "../../domain/repositories/user.repository.js";

/**
 * Supabase Admin API adapter.
 * Account creation/credential updates happen in Supabase Auth
 * (BR-008); the local `users` row mirrors it for roles & member link.
 */
export interface SupabaseAdminService {
  createUser(input: {
    email: string;
    password: string;
    name: string;
    role: string;
  }): Promise<{ authUserId: string }>;
  updatePassword(authUserId: string, newPassword: string): Promise<void>;
  updateEmail(authUserId: string, newEmail: string): Promise<void>;
  deactivate(authUserId: string): Promise<void>;
}

export type CreateUserWithMemberInput = Omit<CreateUserInput, "memberId"> & {
  memberId: string | null;
};

/**
 * BR-009 — One Leadership Post Rule.
 * Validates the proposed (role, sub-dept assignments) combination before
 * any write happens. Throws LeaderMustBeMemberError-typed violation errors.
 */
function assertLeadershipAllowed(params: {
  executiveRole: string | null;
  existingMemberships: MembershipRow[];
  proposedMemberships: MembershipRow[];
  mode?: "assign" | "replace";
}): void {
  const result = checkLeadershipExclusivity(params);
  if (!result.allowed) {
    throw new LeadershipConflictError(
      params.proposedMemberships.map((m) => `${m.role}@${m.subDepartmentCode}`).join(", ") ||
        params.executiveRole ||
        "-",
      result.reason
    );
  }
}

export class CreateUserAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly supabaseAdmin: SupabaseAdminService
  ) {}

  async execute(input: CreateUserWithMemberInput): Promise<UserWithSubDepartments> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new UserAccountExistsError(input.email);
    }

    // BR-009: check existing memberships of the linked member before granting a role
    if (input.memberId) {
      const existingMemberships = await this.userRepository.getMemberships(input.memberId);
      assertLeadershipAllowed({
        executiveRole: input.role,
        existingMemberships,
        proposedMemberships: [],
      });
    }

    // BR-008: provision credentials in Supabase Auth first, then mirror the
    // local users row keyed by the auth user id so requireAuth() can resolve
    // the login against it.
    const { authUserId } = await this.supabaseAdmin.createUser({
      email: input.email,
      password: input.password,
      name: input.name,
      role: input.role,
    });

    return this.userRepository.create(authUserId, input);
  }
}

export class UpdateUserAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly supabaseAdmin: SupabaseAdminService
  ) {}

  async execute(id: string, input: UpdateUserInput): Promise<UserWithSubDepartments> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    // BR-009 direction 1: role change → check against existing memberships
    if (input.role && input.role !== user.role) {
      const existingMemberships = user.memberId
        ? await this.userRepository.getMemberships(user.memberId)
        : [];
      assertLeadershipAllowed({
        executiveRole: input.role,
        existingMemberships,
        proposedMemberships: [],
      });
    }

    // BR-009 direction 2: assignment change → check against (possibly new) role
    if (input.subDepartmentIds && user.memberId) {
      const existingMemberships = await this.userRepository.getMemberships(user.memberId);
      const newRole = input.role ?? user.role;
      const proposed = input.subDepartmentIds.map((subDepartmentId) => ({
        subDepartmentId,
        role: "Member",
      }));
      // Fetch codes for the proposed ids for a precise error message
      const codes = await this.userRepository.getSubDepartmentCodes(input.subDepartmentIds);
      const proposedRows: MembershipRow[] = proposed.map((p) => ({
        subDepartmentCode: codes.get(p.subDepartmentId) ?? p.subDepartmentId,
        role: p.role,
      }));
      assertLeadershipAllowed({
        executiveRole: newRole,
        existingMemberships,
        proposedMemberships: proposedRows,
      });
    }

    // BR-008: keep credentials in sync with Supabase Auth (the local users.id
    // equals the Supabase auth user id for both seeded and API-created accounts).
    if (input.email && input.email !== user.email) {
      await this.supabaseAdmin.updateEmail(user.id, input.email);
    }

    const updated = await this.userRepository.update(id, input);

    if (input.subDepartmentIds && updated.memberId) {
      await this.userRepository.setSubDepartments(updated.memberId, input.subDepartmentIds);
      return (await this.userRepository.findById(id)) ?? updated;
    }

    return updated;
  }
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: { page?: number; limit?: number; search?: string; role?: string }) {
    return this.userRepository.list(params);
  }
}

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserWithSubDepartments> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    return user;
  }
}

export class DeactivateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly supabaseAdmin: SupabaseAdminService
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    // Ban the Supabase Auth account (blocks new logins immediately), then
    // mark the local mirror as unverified.
    await this.supabaseAdmin.deactivate(user.id);
    await this.userRepository.setEmailVerified(id, false);
  }
}

export type { MemberNotFoundError, UserAccountExistsError, UserNotFoundError };
