import type { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.js";
import { RecordAuditLogUseCase } from "../../modules/audit/application/use-cases/record-audit-log.use-case.js";
import { DrizzleAuditLogRepository } from "../../modules/audit/infrastructure/repositories/audit-log.repository.js";

const recordAuditLog = new RecordAuditLogUseCase(new DrizzleAuditLogRepository());

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Paths whose controllers already record their own, richer audit entries.
 * Derived from env.API_PREFIX so deployment-specific prefixes stay in sync.
 */
const SELF_AUDITED_PREFIXES = [`${env.API_PREFIX}/users`, `${env.API_PREFIX}/audit-logs`];

/**
 * PE-07 / FR-13.12: Break-Glass Action Logging.
 *
 * The SUPER_ADMIN role bypasses all permission checks
 * (packages/permissions/src/checker.ts, requireScopePermission). Every
 * write request that was allowed *only* through that bypass must be
 * recorded in the audit trail, including actions on resources outside
 * normal RBAC scope.
 *
 * Mounted globally before routers. `requireScopePermission` flags the
 * bypass on the request; the audit row is written on response finish,
 * when requireAuth has resolved the acting user.
 */
export function breakGlassAuditMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!WRITE_METHODS.has(req.method) || !req.permissionBypassUsed) {
    next();
    return;
  }

  // Users/audit-logs controllers already audit with full context — skip to
  // avoid double entries.
  if (SELF_AUDITED_PREFIXES.some((prefix) => req.originalUrl.startsWith(prefix))) {
    next();
    return;
  }

  res.on("finish", () => {
    const actor = req.sessionUser;
    if (!actor) return;

    void recordAuditLog.execute(
      { id: actor.id, email: actor.email },
      {
        action: "BYPASS_ACTION",
        resourceType: extractResourceType(req.baseUrl || req.path),
        resourceId: extractResourceId(req.path),
        payloadDiff: `${req.method} ${req.originalUrl} → ${res.statusCode}`,
        ipAddress: req.ip,
      }
    );
  });

  next();
}

/**
 * Resource type from the mounted route (e.g. "members", "planning") —
 * the first segment after the API prefix.
 */
function extractResourceType(baseUrl: string): string {
  let path = baseUrl;
  if (path.startsWith(env.API_PREFIX)) {
    path = path.slice(env.API_PREFIX.length);
  }
  const segment = path.replace(/^\//, "").split("/")[0];
  return segment || "resource";
}

/** Best-effort resource id from the URL (last UUID-looking segment). */
function extractResourceId(path: string): string {
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = path.match(uuidPattern);
  return match ? match[0] : "n/a";
}
 