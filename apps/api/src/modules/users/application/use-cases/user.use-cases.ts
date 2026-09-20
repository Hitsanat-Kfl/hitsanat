import { checkLeadershipExclusivity, type MembershipRow } from "@repo/permissions";
import type { CreateUserInput, UpdateUserInput } from "@repo/validation";
import {
  AccountNotDeactivatedError,
  AccountSelfDeactivationError,
  LastAdminAccountError,
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
  /** PE-01 / FR-13.6: lift the auth-system ban so sign-in works again. */
  reactivate(authUserId: string): Promise<void>;
  /** PE-08 / FR-13.13: revoke all live sessions for the user. */
  revokeSessions(authUserId: string): Promise<void>;
}

export type CreateUserWithMemberInput = Omit<CreateUserInput, "memberId"> & {
  memberId: string | null;
};

export interface AuditActorInfo {
  id: string;
  email: string;
}

/**
 * Best-effort audit sink for administrative actions. Implemented by the
 * audit module's RecordAuditLogUseCase; optional so existing callers and
 * tests are unaffected. Failures inside the sink never fail the action.
 */
export interface UserAuditSink {
  record(
    actor: AuditActorInfo,
    input: {
      action: string;
      resourceType: string;
      resourceId: string;
      payloadDiff?: string;
    }
  ): Promise<void>;
}

export interface UserAuditContext {
  auditSink?: UserAuditSink;
  actor?: AuditActorInfo | null;
}

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

/**
 * PE-06 / FR-13.11: roles protected by the last-admin guard rail.
 */
function isExecutiveRole(role: string): boolean {
  return role === "SUPER_ADMIN" || role === "CHAIRPERSON";
}

export class CreateUserAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly supabaseAdmin: SupabaseAdminService,
    private readonly audit?: UserAuditContext
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

    const created = await this.userRepository.create(authUserId, input);

    if (this.audit?.actor && this.audit.auditSink) {
      await this.audit.auditSink.record(this.audit.actor, {
        action: "USER_CREATED",
        resourceType: "user",
        resourceId: created.id,
        payloadDiff: `email=${input.email}; role=${input.role}`,
      });
    }

    return created;
  }
}

export class UpdateUserAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly supabaseAdmin: SupabaseAdminService,
    private readonly audit?: UserAuditContext
  ) {}

  async execute(id: string, input: UpdateUserInput): Promise<UserWithSubDepartments> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    // PE-06 / FR-13.11 hardening: demoting the last active executive would
    // leave the system without an administrator — same guard rail as
    // deactivation applies to role changes.
    if (
      input.role &&
      input.role !== user.role &&
      user.status === "ACTIVE" &&
      isExecutiveRole(user.role) &&
      !isExecutiveRole(input.role)
    ) {
      const activeExecutives = await this.userRepository.countActiveExecutives();
      if (activeExecutives <= 1) {
        throw new LastAdminAccountError();
      }
    }

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

    if (this.audit?.actor && this.audit.auditSink) {
      // PE-02 / FR-13.7: record a field-level old → new diff (never secrets).
      const diffs: string[] = [];
      if (input.name !== undefined && input.name !== user.name) {
        diffs.push(`name: ${user.name} → ${input.name}`);
      }
      if (input.email !== undefined && input.email !== user.email) {
        diffs.push(`email: ${user.email} → ${input.email}`);
      }
      if (input.role !== undefined && input.role !== user.role) {
        diffs.push(`role: ${user.role} → ${input.role}`);
      }
      if (input.memberId !== undefined && input.memberId !== user.memberId) {
        diffs.push(`memberId: ${user.memberId ?? "null"} → ${input.memberId ?? "null"}`);
      }
      if (diffs.length === 0) diffs.push("no field changes");

      await this.audit.auditSink.record(this.audit.actor, {
        action: "USER_UPDATED",
        resourceType: "user",
        resourceId: updated.id,
        payloadDiff: diffs.join("; "),
      });
    }

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
    private readonly supabaseAdmin: SupabaseAdminService,
    private readonly audit?: UserAuditContext
  ) {}

  /**
   * @param actorId id of the acting admin — required for the PE-06
   *   self-deactivation guard rail. Passed explicitly so direct use-case
   *   invocations (tests, scripts) cannot skip the check.
   */
  async execute(id: string, actorId?: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    // PE-06 / FR-13.11: block deactivating your own account.
    if (actorId && actorId === id) {
      throw new AccountSelfDeactivationError();
    }

    // PE-06 / FR-13.11: block deactivating the last active executive.
    if (isExecutiveRole(user.role)) {
      const activeExecutives = await this.userRepository.countActiveExecutives();
      if (activeExecutives <= 1) {
        throw new LastAdminAccountError();
      }
    }

    // Ban the Supabase Auth account (blocks new logins immediately), then
    // mark the local mirror as deactivated. emailVerified keeps its
    // independent meaning (whether the email was confirmed) — the
    // lifecycle lives in `status` (migration 0006).
    await this.supabaseAdmin.deactivate(user.id);
    await this.userRepository.setStatus(id, "DEACTIVATED", new Date());

    if (this.audit?.actor && this.audit.auditSink) {
      await this.audit.auditSink.record(this.audit.actor, {
        action: "USER_DEACTIVATED",
        resourceType: "user",
        resourceId: user.id,
        payloadDiff: `email=${user.email}`,
      });
    }
  }
}

/**
 * PE-01 / FR-13.6: restore a deactivated account (unban in Supabase Auth
 * and flip the local status back to ACTIVE).
 */
export class ReactivateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly supabaseAdmin: SupabaseAdminService,
    private readonly audit?: UserAuditContext
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    if (user.status !== "DEACTIVATED") {
      throw new AccountNotDeactivatedError(id);
    }

    await this.supabaseAdmin.reactivate(user.id);
    await this.userRepository.setStatus(id, "ACTIVE", null);

    if (this.audit?.actor && this.audit.auditSink) {
      await this.audit.auditSink.record(this.audit.actor, {
        action: "USER_REACTIVATED",
        resourceType: "user",
        resourceId: user.id,
        payloadDiff: `email=${user.email}`,
      });
    }
  }
}

/**
 * PE-08 / FR-13.13: force sign-out of a user's live sessions
 * (e.g. stolen credentials) independent of account deactivation.
 */
export class RevokeUserSessionsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly supabaseAdmin: SupabaseAdminService,
    private readonly audit?: UserAuditContext
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    await this.supabaseAdmin.revokeSessions(user.id);

    if (this.audit?.actor && this.audit.auditSink) {
      await this.audit.auditSink.record(this.audit.actor, {
        action: "SESSIONS_REVOKED",
        resourceType: "user",
        resourceId: user.id,
        payloadDiff: `email=${user.email}`,
      });
    }
  }
}

export type {
  AccountNotDeactivatedError,
  AccountSelfDeactivationError,
  LastAdminAccountError,
  MemberNotFoundError,
  UserAccountExistsError,
  UserNotFoundError,
};
