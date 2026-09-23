import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AlreadyRevokedError,
  CreatePermissionGrantUseCase,
  GrantManagementForbiddenError,
  ListPermissionGrantsUseCase,
  PermissionGrantNotFoundError,
  RevokePermissionGrantUseCase,
} from "../../src/modules/permission-grants/application/use-cases/permission-grant.use-cases.js";
import type { PermissionGrantRepository } from "../../src/modules/permission-grants/domain/repositories/permission-grant.repository.js";
import type { PermissionGrant } from "@repo/permissions";

const NOW = new Date("2026-09-23T12:00:00.000Z");

function makeGrant(overrides: Partial<PermissionGrant> = {}): PermissionGrant {
  return {
    id: "g1",
    userId: "u-target",
    resource: "members",
    action: "C",
    reason: "Secretary unavailable",
    expiresAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
    revokedAt: null,
    grantedBy: "u-admin",
    revokedBy: null,
    createdAt: NOW,
    ...overrides,
  };
}

function createMockRepo(): PermissionGrantRepository {
  return {
    create: vi.fn().mockResolvedValue(makeGrant()),
    findMany: vi.fn().mockResolvedValue({ entries: [makeGrant()], total: 1 }),
    findById: vi.fn().mockResolvedValue(makeGrant()),
    revoke: vi.fn().mockResolvedValue(makeGrant({ revokedAt: NOW, revokedBy: "u-admin" })),
  };
}

const superAdmin = { id: "u-admin", email: "admin@hitsanat.org", globalRoles: ["SUPER_ADMIN"] };
const chairperson = {
  id: "u-chair",
  email: "chair@hitsanat.org",
  globalRoles: ["CHAIRPERSON"],
};

describe("CreatePermissionGrantUseCase", () => {
  let repo: PermissionGrantRepository;
  let useCase: CreatePermissionGrantUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new CreatePermissionGrantUseCase(repo);
  });

  it("allows SUPER_ADMIN to create a valid grant", async () => {
    const grant = await useCase.execute(superAdmin, {
      userId: "u-target",
      resource: "members",
      action: "C",
      expiresAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
      reason: "Secretary unavailable",
    });

    expect(repo.create).toHaveBeenCalledOnce();
    expect(grant.resource).toBe("members");
    expect(grant.action).toBe("C");
  });

  it("rejects non-SUPER_ADMIN actors (BR-035)", async () => {
    await expect(
      useCase.execute(chairperson, {
        userId: "u-target",
        resource: "members",
        action: "C",
        expiresAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
      })
    ).rejects.toThrow(GrantManagementForbiddenError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("rejects expiry beyond the 7-day cap", async () => {
    await expect(
      useCase.execute(superAdmin, {
        userId: "u-target",
        resource: "members",
        action: "C",
        expiresAt: new Date(NOW.getTime() + 8 * 24 * 60 * 60 * 1000),
      })
    ).rejects.toThrow(/7 days/);
  });

  it("records PERMISSION_GRANT_CREATED in the audit sink when provided", async () => {
    const auditSink = { record: vi.fn().mockResolvedValue(undefined) };
    await useCase.execute(
      superAdmin,
      {
        userId: "u-target",
        resource: "members",
        action: "C",
        expiresAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
      },
      { auditSink, actor: { id: superAdmin.id, email: superAdmin.email }, ipAddress: "1.2.3.4" }
    );

    expect(auditSink.record).toHaveBeenCalledWith(
      { id: "u-admin", email: "admin@hitsanat.org" },
      expect.objectContaining({
        action: "PERMISSION_GRANT_CREATED",
        resourceType: "permission_grant",
        resourceId: "g1",
        payloadDiff: expect.stringContaining("members:C"),
      })
    );
  });
});

describe("ListPermissionGrantsUseCase", () => {
  it("lists grants for SUPER_ADMIN only", async () => {
    const repo = createMockRepo();
    const useCase = new ListPermissionGrantsUseCase(repo);

    const page = await useCase.execute(superAdmin, { userId: "u-target" });
    expect(page.total).toBe(1);
    expect(repo.findMany).toHaveBeenCalledWith({ userId: "u-target" });

    await expect(useCase.execute(chairperson)).rejects.toThrow(GrantManagementForbiddenError);
  });
});

describe("RevokePermissionGrantUseCase", () => {
  let repo: PermissionGrantRepository;
  let useCase: RevokePermissionGrantUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new RevokePermissionGrantUseCase(repo);
  });

  it("revokes an active grant for SUPER_ADMIN and audits it", async () => {
    const auditSink = { record: vi.fn().mockResolvedValue(undefined) };
    const grant = await useCase.execute(superAdmin, "g1", {
      auditSink,
      actor: { id: superAdmin.id, email: superAdmin.email },
    });

    expect(repo.revoke).toHaveBeenCalledWith("g1", "u-admin");
    expect(grant.revokedAt).not.toBeNull();
    expect(auditSink.record).toHaveBeenCalledWith(
      { id: "u-admin", email: "admin@hitsanat.org" },
      expect.objectContaining({ action: "PERMISSION_GRANT_REVOKED" })
    );
  });

  it("rejects non-SUPER_ADMIN actors", async () => {
    await expect(useCase.execute(chairperson, "g1")).rejects.toThrow(GrantManagementForbiddenError);
    expect(repo.revoke).not.toHaveBeenCalled();
  });

  it("404s when the grant does not exist", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);
    await expect(useCase.execute(superAdmin, "missing")).rejects.toThrow(
      PermissionGrantNotFoundError
    );
  });

  it("rejects double revoke", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeGrant({ revokedAt: NOW }));
    await expect(useCase.execute(superAdmin, "g1")).rejects.toThrow(AlreadyRevokedError);
  });
});
