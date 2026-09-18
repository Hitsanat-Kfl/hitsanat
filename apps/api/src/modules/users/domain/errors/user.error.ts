/**
 * BR-008: only SUPER_ADMIN and CHAIRPERSON may manage user accounts.
 * Enforced at router level via requireScopePermission; this error is a
 * defensive in-domain guard for direct use-case invocations.
 */
export class UserManagementForbiddenError extends Error {
  constructor(message = "Only SUPER_ADMIN or CHAIRPERSON can manage user accounts (BR-008)") {
    super(message);
    this.name = "UserManagementForbiddenError";
  }
}

/** BR-007: leadership accounts must be linked to a registered, active member. */
export class LeaderMustBeMemberError extends Error {
  constructor(memberId: string, reason: string) {
    super(`BR-007 violation: leadership account cannot be linked to member ${memberId}: ${reason}`);
    this.name = "LeaderMustBeMemberError";
  }
}

/**
 * BR-009: one leadership post per member — the proposed role/assignment
 * conflicts with a leadership post the member already holds.
 */
export class LeadershipConflictError extends Error {
  constructor(proposed: string, reason: string) {
    super(`BR-009 violation: cannot assign ${proposed}: ${reason}`);
    this.name = "LeadershipConflictError";
  }
}

export class UserAccountExistsError extends Error {
  constructor(email: string) {
    super(`User account already exists: ${email}`);
    this.name = "UserAccountExistsError";
  }
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User not found: ${id}`);
    this.name = "UserNotFoundError";
  }
}

export class MemberNotFoundError extends Error {
  constructor(id: string) {
    super(`Member not found: ${id}`);
    this.name = "MemberNotFoundError";
  }
}
