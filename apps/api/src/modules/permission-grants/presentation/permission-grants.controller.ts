import type { Request, Response } from "express";
import { GrantValidationError } from "@repo/permissions";
import { RecordAuditLogUseCase } from "../../audit/application/use-cases/record-audit-log.use-case.js";
import { DrizzleAuditLogRepository } from "../../audit/infrastructure/repositories/audit-log.repository.js";
import {
  AlreadyRevokedError,
  CreatePermissionGrantUseCase,
  GrantManagementForbiddenError,
  ListPermissionGrantsUseCase,
  PermissionGrantNotFoundError,
  RevokePermissionGrantUseCase,
  type GrantAuditContext,
} from "../application/use-cases/permission-grant.use-cases.js";
import { DrizzlePermissionGrantRepository } from "../infrastructure/repositories/permission-grant.repository.js";
import type { PermissionGrantPage } from "../domain/repositories/permission-grant.repository.js";

const grantRepository = new DrizzlePermissionGrantRepository();
const recordAuditLog = new RecordAuditLogUseCase(new DrizzleAuditLogRepository());

function auditContext(req: Request): GrantAuditContext | undefined {
  const user = req.sessionUser;
  if (!user) return undefined;
  return {
    auditSink: {
      record: async (actor, input) => {
        await recordAuditLog.execute(actor, {
          action: input.action,
          resourceType: input.resourceType,
          resourceId: input.resourceId,
          ...(input.payloadDiff !== undefined ? { payloadDiff: input.payloadDiff } : {}),
          ...(input.ipAddress !== undefined ? { ipAddress: input.ipAddress } : {}),
        });
      },
    },
    actor: { id: user.id, email: user.email },
    ipAddress: req.ip ?? null,
  };
}

function requireSuperAdmin(req: Request): {
  id: string;
  email: string;
  globalRoles: string[];
} {
  const user = req.sessionUser;
  if (!user) {
    throw new GrantManagementForbiddenError("Authentication required");
  }
  if (!user.globalRoles.includes("SUPER_ADMIN")) {
    throw new GrantManagementForbiddenError();
  }
  return { id: user.id, email: user.email, globalRoles: user.globalRoles };
}

export async function createPermissionGrant(req: Request, res: Response) {
  try {
    const actor = requireSuperAdmin(req);
    const body = req.body as {
      userId?: string;
      resource?: string;
      action?: string;
      expiresAt?: string;
      reason?: string;
    };
    if (!body.userId || !body.resource || !body.action || !body.expiresAt) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "userId, resource, action, expiresAt required",
        },
      });
      return;
    }
    const useCase = new CreatePermissionGrantUseCase(grantRepository);
    const grant = await useCase.execute(
      actor,
      {
        userId: body.userId,
        resource: body.resource,
        action: body.action,
        expiresAt: new Date(body.expiresAt),
        reason: body.reason ?? null,
      },
      auditContext(req)
    );
    res.status(201).json({ success: true, data: grant });
  } catch (error) {
    handleError(res, error);
  }
}

export async function listPermissionGrants(req: Request, res: Response) {
  try {
    const actor = requireSuperAdmin(req);
    const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const useCase = new ListPermissionGrantsUseCase(grantRepository);
    const page: PermissionGrantPage = await useCase.execute(actor, { userId, limit, offset });
    res.status(200).json({
      success: true,
      data: page.entries,
      pagination: {
        limit,
        offset,
        total: page.total,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
}

export async function revokePermissionGrant(req: Request, res: Response) {
  try {
    const actor = requireSuperAdmin(req);
    const useCase = new RevokePermissionGrantUseCase(grantRepository);
    const grant = await useCase.execute(actor, req.params.id as string, auditContext(req));
    res.status(200).json({ success: true, data: grant });
  } catch (error) {
    handleError(res, error);
  }
}

function handleError(res: Response, error: unknown): void {
  const message = error instanceof Error ? error.message : "Unknown error";
  if (error instanceof GrantManagementForbiddenError) {
    res.status(403).json({ success: false, error: { code: "FORBIDDEN", message } });
  } else if (error instanceof PermissionGrantNotFoundError) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message } });
  } else if (error instanceof AlreadyRevokedError) {
    res.status(409).json({ success: false, error: { code: "ALREADY_REVOKED", message } });
  } else if (error instanceof GrantValidationError) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message } });
  } else if (error instanceof RangeError || message.includes("valid date")) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message } });
  } else {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message } });
  }
}
