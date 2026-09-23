import { describe, expect, it } from "vitest";
import {
  ActionType,
  GrantValidationError,
  MAX_GRANT_DURATION_DAYS,
  ResourceType,
  grantLabel,
  grantToPermission,
  hasActiveGrant,
  isGrantActive,
  isValidAction,
  isValidResource,
  validateGrantPayload,
  type PermissionGrant,
} from "../index.js";

const NOW = new Date("2026-09-23T12:00:00.000Z");

function makeGrant(overrides: Partial<PermissionGrant> = {}): PermissionGrant {
  return {
    id: "g1",
    userId: "u1",
    resource: ResourceType.MEMBERS,
    action: ActionType.CREATE,
    reason: null,
    expiresAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
    revokedAt: null,
    grantedBy: "admin1",
    revokedBy: null,
    createdAt: NOW,
    ...overrides,
  };
}

describe("grant activity helpers", () => {
  it("treats an unrevoked, unexpired grant as active", () => {
    expect(isGrantActive(makeGrant(), NOW)).toBe(true);
  });

  it("treats a revoked grant as inactive even before expiry", () => {
    expect(isGrantActive(makeGrant({ revokedAt: NOW }), NOW)).toBe(false);
  });

  it("treats an expired grant as inactive", () => {
    expect(isGrantActive(makeGrant({ expiresAt: NOW }), NOW)).toBe(false);
    expect(isGrantActive(makeGrant({ expiresAt: new Date(NOW.getTime() - 1) }), NOW)).toBe(false);
  });

  it("hasActiveGrant matches only the exact resource+action while active", () => {
    const grants = [
      makeGrant(),
      makeGrant({ id: "g2", action: ActionType.READ }),
      makeGrant({ id: "g3", resource: ResourceType.FAMILIES, action: ActionType.READ }),
      makeGrant({ id: "g4", revokedAt: NOW }),
      makeGrant({ id: "g5", expiresAt: NOW }),
    ];

    expect(hasActiveGrant(grants, ResourceType.MEMBERS, ActionType.CREATE, NOW)).toBe(true);
    expect(hasActiveGrant(grants, ResourceType.MEMBERS, ActionType.READ, NOW)).toBe(true);
    expect(hasActiveGrant(grants, ResourceType.FAMILIES, ActionType.READ, NOW)).toBe(true);
    expect(hasActiveGrant(grants, ResourceType.FAMILIES, ActionType.CREATE, NOW)).toBe(false);
    expect(hasActiveGrant(grants, ResourceType.MEMBERS, ActionType.UPDATE, NOW)).toBe(false);
  });
});

describe("validateGrantPayload (BR-035)", () => {
  const base = {
    userId: "u1",
    resource: ResourceType.MEMBERS,
    action: ActionType.CREATE,
    expiresAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
  };

  it("accepts a valid payload", () => {
    expect(() => validateGrantPayload(base, NOW)).not.toThrow();
  });

  it("rejects unknown resource or action", () => {
    expect(() => validateGrantPayload({ ...base, resource: "nope" }, NOW)).toThrow(
      GrantValidationError
    );
    expect(() => validateGrantPayload({ ...base, action: "X" }, NOW)).toThrow(GrantValidationError);
  });

  it("requires a future expiry", () => {
    expect(() => validateGrantPayload({ ...base, expiresAt: NOW }, NOW)).toThrow(
      /must be in the future/
    );
    expect(() =>
      validateGrantPayload({ ...base, expiresAt: new Date(NOW.getTime() - 1000) }, NOW)
    ).toThrow(/must be in the future/);
  });

  it(`caps expiry at ${MAX_GRANT_DURATION_DAYS} days`, () => {
    const tooFar = new Date(NOW.getTime() + (MAX_GRANT_DURATION_DAYS + 1) * 24 * 60 * 60 * 1000);
    expect(() => validateGrantPayload({ ...base, expiresAt: tooFar }, NOW)).toThrow(
      new RegExp(`${MAX_GRANT_DURATION_DAYS} days`)
    );

    const maxOk = new Date(NOW.getTime() + MAX_GRANT_DURATION_DAYS * 24 * 60 * 60 * 1000);
    expect(() => validateGrantPayload({ ...base, expiresAt: maxOk }, NOW)).not.toThrow();
  });

  it("rejects a missing userId", () => {
    expect(() => validateGrantPayload({ ...base, userId: "" }, NOW)).toThrow(/userId/);
  });

  it("rejects an invalid date", () => {
    expect(() => validateGrantPayload({ ...base, expiresAt: new Date("nope") }, NOW)).toThrow(
      GrantValidationError
    );
  });
});

describe("resource/action validation helpers", () => {
  it("recognizes known resources and actions", () => {
    expect(isValidResource(ResourceType.MEMBERS)).toBe(true);
    expect(isValidResource("bogus")).toBe(false);
    expect(isValidAction(ActionType.APPROVE)).toBe(true);
    expect(isValidAction("Z")).toBe(false);
  });

  it("builds a compact grant label and maps to Permission", () => {
    const grant = makeGrant();
    expect(grantLabel(grant.resource, grant.action)).toBe("members:C");
    expect(grantToPermission(grant)).toEqual({
      resource: ResourceType.MEMBERS,
      action: ActionType.CREATE,
    });
  });
});
