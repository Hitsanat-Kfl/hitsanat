import { beforeEach, describe, expect, it, vi } from "vitest";
import { ListAuditLogsUseCase } from "../../src/modules/audit/application/use-cases/list-audit-logs.use-case.js";
import { RecordAuditLogUseCase } from "../../src/modules/audit/application/use-cases/record-audit-log.use-case.js";
import type { AuditLogRepository } from "../../src/modules/audit/domain/repositories/audit-log.repository.js";

function createMockRepo(): AuditLogRepository {
  return {
    record: vi.fn().mockResolvedValue(undefined),
    findRecent: vi.fn().mockResolvedValue([
      {
        id: "a1",
        operatorId: "u1",
        action: "USER_CREATED",
        resourceType: "user",
        resourceId: "u2",
        payloadDiff: "email=leader@hitsanat.org; role=SECRETARY",
        ipAddress: null,
        timestamp: new Date("2026-01-01T00:00:00Z"),
      },
    ]),
  };
}

const actor = { id: "u1", email: "admin@hitsanat.org" };

describe("RecordAuditLogUseCase", () => {
  let repo: AuditLogRepository;
  let useCase: RecordAuditLogUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new RecordAuditLogUseCase(repo);
  });

  it("records an action with actor and resource payload", async () => {
    await useCase.execute(actor, {
      action: "USER_CREATED",
      resourceType: "user",
      resourceId: "u2",
      payloadDiff: "email=leader@hitsanat.org; role=SECRETARY",
    });

    expect(repo.record).toHaveBeenCalledOnce();
    expect(repo.record).toHaveBeenCalledWith(actor, {
      action: "USER_CREATED",
      resourceType: "user",
      resourceId: "u2",
      payloadDiff: "email=leader@hitsanat.org; role=SECRETARY",
    });
  });

  it("records without optional fields", async () => {
    await useCase.execute(actor, {
      action: "USER_DEACTIVATED",
      resourceType: "user",
      resourceId: "u2",
    });

    expect(repo.record).toHaveBeenCalledWith(actor, {
      action: "USER_DEACTIVATED",
      resourceType: "user",
      resourceId: "u2",
    });
  });

  it("swallows repository failures so auditing never breaks the primary action", async () => {
    vi.mocked(repo.record).mockRejectedValue(new Error("audit sink down"));

    await expect(
      useCase.execute(actor, { action: "USER_DEACTIVATED", resourceType: "user", resourceId: "u2" })
    ).resolves.toBeUndefined();

    expect(repo.record).toHaveBeenCalledOnce();
  });
});

describe("ListAuditLogsUseCase", () => {
  let repo: AuditLogRepository;
  let useCase: ListAuditLogsUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new ListAuditLogsUseCase(repo);
  });

  it("returns recent entries from the repository", async () => {
    const logs = await useCase.execute({ limit: 20 });
    expect(logs).toHaveLength(1);
    expect(logs[0]?.action).toBe("USER_CREATED");
    expect(repo.findRecent).toHaveBeenCalledWith({ limit: 20 });
  });

  it("defaults the limit when not provided", async () => {
    await useCase.execute({});
    expect(repo.findRecent).toHaveBeenCalledWith({ limit: 20 });
  });

  it("caps the limit at 100", async () => {
    await useCase.execute({ limit: 5000 });
    expect(repo.findRecent).toHaveBeenCalledWith({ limit: 100 });
  });

  it("floors invalid limits to 1", async () => {
    await useCase.execute({ limit: 0 });
    expect(repo.findRecent).toHaveBeenCalledWith({ limit: 1 });
  });
});
