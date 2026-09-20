import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";

const recordMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock("../../src/modules/audit/infrastructure/repositories/audit-log.repository.js", () => ({
  DrizzleAuditLogRepository: class {
    record = recordMock;
  },
}));

import { breakGlassAuditMiddleware } from "../../src/shared/middleware/break-glass-audit.js";

type MockRequest = Partial<Request> & {
  permissionBypassUsed?: boolean;
  sessionUser?: { id: string; email: string } | null;
};

function createReq(overrides: MockRequest = {}): Request {
  return {
    method: "POST",
    baseUrl: "/api/v1/members",
    originalUrl: "/api/v1/members/m1",
    path: "/api/v1/members/m1",
    ip: "10.0.0.7",
    sessionUser: { id: "admin-1", email: "admin@hitsanat.org" },
    permissionBypassUsed: true,
    ...overrides,
  } as unknown as Request;
}

function createRes(statusCode = 200): Response & EventEmitter {
  const res = new EventEmitter() as unknown as Response & EventEmitter;
  (res as { statusCode: number }).statusCode = statusCode;
  return res;
}

function run(req: Request): { res: Response & EventEmitter; next: () => void } {
  const res = createRes();
  const next = vi.fn();
  breakGlassAuditMiddleware(req, res, next as () => void);
  return { res, next: next as () => void };
}

describe("breakGlassAuditMiddleware (PE-07 / FR-13.12)", () => {
  beforeEach(() => {
    recordMock.mockClear();
  });

  it("passes read requests through without auditing", () => {
    const { next } = run(createReq({ method: "GET" }));

    expect(next).toHaveBeenCalledOnce();
    expect(recordMock).not.toHaveBeenCalled();
  });

  it("ignores write requests that did not use the permission bypass", () => {
    const { next } = run(createReq({ permissionBypassUsed: false }));

    expect(next).toHaveBeenCalledOnce();
    expect(recordMock).not.toHaveBeenCalled();
  });

  it("audits a bypassed write on response finish", () => {
    const { res } = run(createReq());

    res.emit("finish");

    expect(recordMock).toHaveBeenCalledOnce();
    const [actor, input] = recordMock.mock.calls[0] as [
      { id: string; email: string },
      {
        action: string;
        resourceType: string;
        resourceId: string;
        payloadDiff: string;
        ipAddress: string;
      },
    ];
    expect(actor).toEqual({ id: "admin-1", email: "admin@hitsanat.org" });
    expect(input.action).toBe("BYPASS_ACTION");
    expect(input.resourceType).toBe("members");
    // "m1" is not a UUID — extraction is best-effort and falls back to n/a.
    expect(input.resourceId).toBe("n/a");
    expect(input.payloadDiff).toContain("POST /api/v1/members/m1 → 200");
    expect(input.ipAddress).toBe("10.0.0.7");
  });

  it("extracts UUID resource ids from the path", () => {
    const { res } = run(
      createReq({
        originalUrl: "/api/v1/members/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        path: "/api/v1/members/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      })
    );

    res.emit("finish");

    const [, input] = recordMock.mock.calls[0] as [
      { id: string; email: string },
      { resourceId: string },
    ];
    expect(input.resourceId).toBe("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d");
  });

  it("skips self-audited routes (users, audit-logs) even under bypass", () => {
    const { res } = run(
      createReq({
        baseUrl: "/api/v1/users",
        originalUrl: "/api/v1/users/u1/deactivate",
        path: "/api/v1/users/u1/deactivate",
      })
    );

    res.emit("finish");

    expect(recordMock).not.toHaveBeenCalled();
  });

  it("does not audit when no session user resolved", () => {
    const { res } = run(createReq({ sessionUser: null }));

    res.emit("finish");

    expect(recordMock).not.toHaveBeenCalled();
  });
});
