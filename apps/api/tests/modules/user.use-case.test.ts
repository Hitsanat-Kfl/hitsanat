import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CreateUserAccountUseCase,
  DeactivateUserUseCase,
  ReactivateUserUseCase,
  RevokeUserSessionsUseCase,
  UpdateUserAccountUseCase,
  type SupabaseAdminService,
  type UserAuditSink,
} from "../../src/modules/users/application/use-cases/user.use-cases.js";
import type {
  UserRepository,
  UserWithSubDepartments,
} from "../../src/modules/users/domain/repositories/user.repository.js";

function userRow(overrides: Partial<UserWithSubDepartments> = {}): UserWithSubDepartments {
  return {
    id: "u1",
    name: "Chair Person",
    email: "chair@hitsanat.org",
    role: "CHAIRPERSON",
    memberId: "m1",
    emailVerified: true,
    status: "ACTIVE",
    deactivatedAt: null,
    image: null,
    subDepartments: [],
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

function createMockRepo(
  initial: UserWithSubDepartments = userRow()
): UserRepository & { users: Map<string, UserWithSubDepartments> } {
  const users = new Map<string, UserWithSubDepartments>([[initial.id, initial]]);
  return {
    users,
    findById: vi.fn(async (id: string) => users.get(id) ?? null),
    findByEmail: vi.fn(async () => null),
    list: vi.fn(async () => ({ users: [...users.values()], total: users.size })),
    create: vi.fn(async (authUserId: string, data) => {
      const row = userRow({ id: authUserId, name: data.name, email: data.email, role: data.role });
      users.set(row.id, row);
      return row;
    }),
    update: vi.fn(async (id: string, data) => {
      const current = users.get(id);
      if (!current) throw new Error(`User not found: ${id}`);
      const next = {
        ...current,
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.memberId !== undefined ? { memberId: data.memberId } : {}),
        updatedAt: new Date(),
      };
      users.set(id, next);
      return next;
    }),
    setSubDepartments: vi.fn(async () => undefined),
    getMemberships: vi.fn(async () => []),
    getSubDepartmentCodes: vi.fn(async () => new Map()),
    setEmailVerified: vi.fn(async () => undefined),
    countActiveExecutives: vi.fn(async () => 2),
    setStatus: vi.fn(async (id: string, status, deactivatedAt) => {
      const current = users.get(id);
      if (current) users.set(id, { ...current, status, deactivatedAt });
    }),
  };
}

function createMockSupabase(): SupabaseAdminService {
  return {
    createUser: vi.fn(async () => ({ authUserId: "auth-1" })),
    updatePassword: vi.fn(async () => undefined),
    updateEmail: vi.fn(async () => undefined),
    deactivate: vi.fn(async () => undefined),
    reactivate: vi.fn(async () => undefined),
    revokeSessions: vi.fn(async () => undefined),
  };
}

function createMockSink(): UserAuditSink & { recorded: Array<{ action: string }> } {
  const recorded: Array<{ action: string }> = [];
  return {
    recorded,
    record: vi.fn(async (_actor, input) => {
      recorded.push({ action: input.action });
    }),
  };
}

const actor = { id: "admin-1", email: "admin@hitsanat.org" };
const audit = (sink: UserAuditSink) => ({ auditSink: sink, actor });

describe("CreateUserAccountUseCase", () => {
  it("creates the account and records USER_CREATED", async () => {
    const repo = createMockRepo();
    const supabase = createMockSupabase();
    const sink = createMockSink();
    const useCase = new CreateUserAccountUseCase(repo, supabase, audit(sink));

    const created = await useCase.execute({
      name: "New Secretary",
      email: "sec@hitsanat.org",
      password: "TempPass123!",
      role: "SECRETARY",
      memberId: null,
    });

    expect(created.role).toBe("SECRETARY");
    expect(supabase.createUser).toHaveBeenCalledOnce();
    expect(sink.recorded.map((r) => r.action)).toEqual(["USER_CREATED"]);
  });

  it("rejects a duplicate email", async () => {
    const repo = createMockRepo();
    repo.findByEmail = vi.fn(async () => userRow());
    const useCase = new CreateUserAccountUseCase(repo, createMockSupabase());

    await expect(
      useCase.execute({
        name: "Dup",
        email: "chair@hitsanat.org",
        password: "TempPass123!",
        role: "SECRETARY",
        memberId: null,
      })
    ).rejects.toThrow(/already exists/);
  });

  it("rejects a leadership role for a member that already holds a post (BR-009)", async () => {
    const repo = createMockRepo();
    // The linked member already holds a Leader post in Timihrt.
    repo.getMemberships = vi.fn(async () => [
      { subDepartmentCode: "TIMIHRT", subDepartmentId: "sd1", role: "Leader" },
    ]);
    const useCase = new CreateUserAccountUseCase(repo, createMockSupabase());

    await expect(
      useCase.execute({
        name: "Second Post",
        email: "second@hitsanat.org",
        password: "TempPass123!",
        role: "SECRETARY",
        memberId: "m1",
      })
    ).rejects.toThrow(/leadership/i);
  });
});

describe("UpdateUserAccountUseCase", () => {
  it("records USER_UPDATED with a field-level diff", async () => {
    const repo = createMockRepo();
    const sink = createMockSink();
    const useCase = new UpdateUserAccountUseCase(repo, createMockSupabase(), audit(sink));

    await useCase.execute("u1", { name: "Renamed Chair", email: "chair@hitsanat.org" });

    const record = vi.mocked(sink.record).mock.calls[0][1];
    expect(record.action).toBe("USER_UPDATED");
    expect(record.payloadDiff).toContain("name: Chair Person → Renamed Chair");
    expect(record.payloadDiff).not.toContain("email:");
  });

  it("blocks demoting the last active executive (PE-06 on role change)", async () => {
    const repo = createMockRepo();
    vi.mocked(repo.countActiveExecutives).mockResolvedValue(1);
    const useCase = new UpdateUserAccountUseCase(repo, createMockSupabase());

    await expect(useCase.execute("u1", { role: "MEMBER_REGULAR" })).rejects.toThrow(
      /last remaining/i
    );
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("allows the same demotion when another active executive remains", async () => {
    const repo = createMockRepo();
    vi.mocked(repo.countActiveExecutives).mockResolvedValue(2);
    const useCase = new UpdateUserAccountUseCase(repo, createMockSupabase());

    await expect(useCase.execute("u1", { role: "MEMBER_REGULAR" })).resolves.toMatchObject({
      role: "MEMBER_REGULAR",
    });
  });

  it("does not apply the last-admin guard to deactivated accounts", async () => {
    const repo = createMockRepo(userRow({ status: "DEACTIVATED" }));
    vi.mocked(repo.countActiveExecutives).mockResolvedValue(1);
    const useCase = new UpdateUserAccountUseCase(repo, createMockSupabase());

    await expect(useCase.execute("u1", { role: "MEMBER_REGULAR" })).resolves.toMatchObject({
      role: "MEMBER_REGULAR",
    });
  });

  it("rejects leadership conflicts on role change (BR-009)", async () => {
    const repo = createMockRepo();
    repo.getMemberships = vi.fn(async () => [
      { subDepartmentCode: "MEZMUR", subDepartmentId: "sd2", role: "Leader" },
    ]);
    const useCase = new UpdateUserAccountUseCase(repo, createMockSupabase());

    await expect(useCase.execute("u1", { role: "SECRETARY" })).rejects.toThrow(/leadership/i);
  });
});

describe("DeactivateUserUseCase", () => {
  it("deactivates, records USER_DEACTIVATED, and stamps deactivatedAt", async () => {
    const repo = createMockRepo();
    const supabase = createMockSupabase();
    const sink = createMockSink();
    const useCase = new DeactivateUserUseCase(repo, supabase, audit(sink));

    await useCase.execute("u1", "admin-1");

    expect(supabase.deactivate).toHaveBeenCalledWith("u1");
    expect(repo.users.get("u1")?.status).toBe("DEACTIVATED");
    expect(repo.users.get("u1")?.deactivatedAt).toBeInstanceOf(Date);
    expect(sink.recorded.map((r) => r.action)).toEqual(["USER_DEACTIVATED"]);
  });

  it("blocks self-deactivation", async () => {
    const useCase = new DeactivateUserUseCase(createMockRepo(), createMockSupabase());
    await expect(useCase.execute("u1", "u1")).rejects.toThrow(/own account/i);
  });

  it("blocks deactivating the last active executive", async () => {
    const repo = createMockRepo();
    vi.mocked(repo.countActiveExecutives).mockResolvedValue(1);
    const useCase = new DeactivateUserUseCase(repo, createMockSupabase());
    await expect(useCase.execute("u1", "admin-1")).rejects.toThrow(/last remaining/i);
  });

  it("blocks deactivating a non-existent user", async () => {
    const useCase = new DeactivateUserUseCase(createMockRepo(), createMockSupabase());
    await expect(useCase.execute("ghost", "admin-1")).rejects.toThrow(/not found/i);
  });
});

describe("ReactivateUserUseCase", () => {
  it("lifts the ban, restores ACTIVE, and records USER_REACTIVATED", async () => {
    const repo = createMockRepo(userRow({ status: "DEACTIVATED", deactivatedAt: new Date() }));
    const supabase = createMockSupabase();
    const sink = createMockSink();
    const useCase = new ReactivateUserUseCase(repo, supabase, audit(sink));

    await useCase.execute("u1");

    expect(supabase.reactivate).toHaveBeenCalledWith("u1");
    expect(repo.users.get("u1")?.status).toBe("ACTIVE");
    expect(repo.users.get("u1")?.deactivatedAt).toBeNull();
    expect(sink.recorded.map((r) => r.action)).toEqual(["USER_REACTIVATED"]);
  });

  it("rejects reactivating an account that is not deactivated", async () => {
    const useCase = new ReactivateUserUseCase(createMockRepo(), createMockSupabase());
    await expect(useCase.execute("u1")).rejects.toThrow(/not deactivated/i);
  });
});

describe("RevokeUserSessionsUseCase", () => {
  it("revokes live sessions and records SESSIONS_REVOKED", async () => {
    const repo = createMockRepo();
    const supabase = createMockSupabase();
    const sink = createMockSink();
    const useCase = new RevokeUserSessionsUseCase(repo, supabase, audit(sink));

    await useCase.execute("u1");

    expect(supabase.revokeSessions).toHaveBeenCalledWith("u1");
    expect(sink.recorded.map((r) => r.action)).toEqual(["SESSIONS_REVOKED"]);
  });

  it("rejects revoking sessions for a non-existent user", async () => {
    const useCase = new RevokeUserSessionsUseCase(createMockRepo(), createMockSupabase());
    await expect(useCase.execute("ghost")).rejects.toThrow(/not found/i);
  });
});
