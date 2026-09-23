import { GrantValidationError, validateGrantPayload } from "@repo/permissions";
import type {
  CreatePermissionGrantRecord,
  PermissionGrant,
  PermissionGrantPage,
  PermissionGrantQuery,
  PermissionGrantRepository,
} from "../../domain/repositories/permission-grant.repository.js";

/** BR-035: only SUPER_ADMIN may issue or revoke temporary grants. */
export class GrantManagementForbiddenError extends Error {
  constructor(message = "Only SUPER_ADMIN can manage temporary permission grants (BR-035)") {
    super(message);
    this.name = "GrantManagementForbiddenError";
  }
}

export class PermissionGrantNotFoundError extends Error {
  constructor(id: string) {
    super(`Permission grant not found: ${id}`);
    this.name = "PermissionGrantNotFoundError";
  }
}

export class AlreadyRevokedError extends Error {
  constructor(id: string) {
    super(`Permission grant already revoked: ${id}`);
    this.name = "AlreadyRevokedError";
  }
}

export type GrantAuditSink = {
  record: (
    actor: { id: string; email: string },
    input: {
      action: string;
      resourceType: string;
      resourceId: string;
      payloadDiff?: string;
      ipAddress?: string;
    }
  ) => Promise<void>;
};

export interface GrantAuditContext {
  auditSink?: GrantAuditSink;
  actor: { id: string; email: string };
  ipAddress?: string | null;
}

function assertSuperAdmin(actorRoles: string[]): void {
  if (!actorRoles.includes("SUPER_ADMIN")) {
    throw new GrantManagementForbiddenError();
  }
}

export class CreatePermissionGrantUseCase {
  constructor(private readonly repository: PermissionGrantRepository) {}

  async execute(
    actor: { id: string; email: string; globalRoles: string[] },
    record: CreatePermissionGrantRecord,
    audit?: GrantAuditContext
  ): Promise<PermissionGrant> {
    assertSuperAdmin(actor.globalRoles);

    const payload = {
      userId: record.userId,
      resource: record.resource,
      action: record.action,
      expiresAt: record.expiresAt,
      reason: record.reason ?? null,
      grantedBy: actor.id,
    };
    validateGrantPayload(payload);

    const grant = await this.repository.create(payload, actor.id);

    if (audit?.auditSink) {
      await audit.auditSink.record(
        { id: actor.id, email: actor.email },
        {
          action: "PERMISSION_GRANT_CREATED",
          resourceType: "permission_grant",
          resourceId: grant.id,
          payloadDiff: `user=${grant.userId}; ${grant.resource}:${grant.action}; expires=${grant.expiresAt.toISOString()}`,
          ...(audit.ipAddress ? { ipAddress: audit.ipAddress } : {}),
        }
      );
    }

    return grant;
  }
}

export class ListPermissionGrantsUseCase {
  constructor(private readonly repository: PermissionGrantRepository) {}

  async execute(
    actor: { globalRoles: string[] },
    query: PermissionGrantQuery = {}
  ): Promise<PermissionGrantPage> {
    assertSuperAdmin(actor.globalRoles);
    return this.repository.findMany(query);
  }
}

export class RevokePermissionGrantUseCase {
  constructor(private readonly repository: PermissionGrantRepository) {}

  async execute(
    actor: { id: string; email: string; globalRoles: string[] },
    grantId: string,
    audit?: GrantAuditContext
  ): Promise<PermissionGrant> {
    assertSuperAdmin(actor.globalRoles);

    const existing = await this.repository.findById(grantId);
    if (!existing) {
      throw new PermissionGrantNotFoundError(grantId);
    }
    if (existing.revokedAt) {
      throw new AlreadyRevokedError(grantId);
    }

    const grant = await this.repository.revoke(grantId, actor.id);

    if (audit?.auditSink) {
      await audit.auditSink.record(
        { id: actor.id, email: actor.email },
        {
          action: "PERMISSION_GRANT_REVOKED",
          resourceType: "permission_grant",
          resourceId: grant.id,
          payloadDiff: `user=${grant.userId}; ${grant.resource}:${grant.action}`,
          ...(audit.ipAddress ? { ipAddress: audit.ipAddress } : {}),
        }
      );
    }

    return grant;
  }
}

export { GrantValidationError };
