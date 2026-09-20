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
    findMany: vi.fn().mockResolvedValue({
      entries: [
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
      ],
      total: 1,
    }),
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

  it("returns a filtered page from the repository", async () => {
    const page = await useCase.execute({ limit: 20, page: 2, action: "USER_CREATED" });
    expect(page.entries).toHaveLength(1);
    expect(page.total).toBe(1);
    expect(repo.findMany).toHaveBeenCalledWith({
      limit: 20,
      offset: 20,
      action: "USER_CREATED",
      operatorId: undefined,
      from: undefined,
      to: undefined,
    });
  });

  it("defaults the limit and page when not provided", async () => {
    await useCase.execute({});
    expect(repo.findMany).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
      action: undefined,
      operatorId: undefined,
      from: undefined,
      to: undefined,
    });
  });

  it("caps the limit at 100", async () => {
    await useCase.execute({ limit: 5000 });
    expect(repo.findMany).toHaveBeenCalledWith(expect.objectContaining({ limit: 100, offset: 0 }));
  });

  it("floors invalid limits to 1", async () => {
    await useCase.execute({ limit: 0 });
    expect(repo.findMany).toHaveBeenCalledWith(expect.objectContaining({ limit: 1, offset: 0 }));
  });

  it("parses date range filters", async () => {
    await useCase.execute({ from: "2026-01-01", to: "2026-01-31" });
    expect(repo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        from: new Date("2026-01-01"),
        to: new Date("2026-01-31"),
      })
    );
  });

  it("ignores invalid date filters", async () => {
    await useCase.execute({ from: "not-a-date" });
    expect(repo.findMany).toHaveBeenCalledWith(expect.objectContaining({ from: undefined }));
  });
});
