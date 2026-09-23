import { ActionType, ResourceType } from "./types.js";
import type { Permission } from "./types.js";

/**
 * Temporary permission grants (BR-035 / ADR-0019).
 *
 * A grant is a SUPER_ADMIN-issued, expiring grant of one resource+action
 * to one user. Active grants are consulted by requireScopePermission when
 * the caller's role/sub-dept check fails for that resource+action.
 */

/** Maximum lifetime of a grant (BR-035). */
export const MAX_GRANT_DURATION_DAYS = 7;

export interface PermissionGrant {
  id: string;
  userId: string;
  resource: ResourceType;
  action: ActionType;
  reason: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  grantedBy: string | null;
  revokedBy: string | null;
  createdAt: Date;
}

const RESOURCE_VALUES = new Set(Object.values(ResourceType) as string[]);
const ACTION_VALUES = new Set(Object.values(ActionType) as string[]);

export function isValidResource(resource: string): resource is ResourceType {
  return RESOURCE_VALUES.has(resource);
}

export function isValidAction(action: string): action is ActionType {
  return ACTION_VALUES.has(action);
}

/**
 * A grant is active when it has not been revoked and has not expired.
 * `now` defaults to the current time so callers can inject a fixed clock
 * in tests.
 */
export function isGrantActive(grant: PermissionGrant, now: Date = new Date()): boolean {
  if (grant.revokedAt) return false;
  return grant.expiresAt.getTime() > now.getTime();
}

/** True when any grant covers the given resource+action and is still active. */
export function hasActiveGrant(
  grants: PermissionGrant[],
  resource: ResourceType,
  action: ActionType,
  now: Date = new Date()
): boolean {
  return grants.some(
    (grant) => grant.resource === resource && grant.action === action && isGrantActive(grant, now)
  );
}

/**
 * Evaluate a permission request against an active grant.
 * Returns true only when the grant covers the exact resource+action
 * and is still active.
 */
export function checkPermissionWithGrant(
  grants: PermissionGrant[],
  resource: ResourceType,
  action: ActionType,
  now: Date = new Date()
): boolean {
  return hasActiveGrant(grants, resource, action, now);
}

export interface CreatePermissionGrantInput {
  userId: string;
  resource: string;
  action: string;
  expiresAt: Date;
  reason?: string | null;
  grantedBy?: string | null;
}

export class GrantValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GrantValidationError";
  }
}

/**
 * Validate a create-grant payload (BR-035).
 * Expiry is mandatory, must be in the future, and must not exceed
 * MAX_GRANT_DURATION_DAYS from now. Resource and action must be known
 * values from the shared permission types.
 */
export function validateGrantPayload(
  input: CreatePermissionGrantInput,
  now: Date = new Date()
): asserts input is CreatePermissionGrantInput & { resource: ResourceType; action: ActionType } {
  if (!input.userId) {
    throw new GrantValidationError("userId is required");
  }
  if (!isValidResource(input.resource)) {
    throw new GrantValidationError(`Unknown resource: ${input.resource}`);
  }
  if (!isValidAction(input.action)) {
    throw new GrantValidationError(`Unknown action: ${input.action}`);
  }
  if (!(input.expiresAt instanceof Date) || Number.isNaN(input.expiresAt.getTime())) {
    throw new GrantValidationError("expiresAt must be a valid date");
  }
  if (input.expiresAt.getTime() <= now.getTime()) {
    throw new GrantValidationError("expiresAt must be in the future");
  }
  const maxExpiresAt = new Date(now.getTime() + MAX_GRANT_DURATION_DAYS * 24 * 60 * 60 * 1000);
  if (input.expiresAt.getTime() > maxExpiresAt.getTime()) {
    throw new GrantValidationError(
      `expiresAt must be within ${MAX_GRANT_DURATION_DAYS} days of now`
    );
  }
}

/** Derive a compact "members:C" style label for a permission (UI/audit use). */
export function grantLabel(resource: ResourceType | string, action: ActionType | string): string {
  return `${resource}:${action}`;
}

/** Map a grant row to the Permission shape used by the shared matrix helpers. */
export function grantToPermission(grant: PermissionGrant): Permission {
  return { resource: grant.resource, action: grant.action };
}
