import type { Request, Response } from "express";
import { requireAuth, requireScopePermission } from "@repo/auth";
import { createUserSchema, resetPasswordSchema, updateUserSchema } from "@repo/validation";
import { RecordAuditLogUseCase } from "../../audit/application/use-cases/record-audit-log.use-case.js";
import { DrizzleAuditLogRepository } from "../../audit/infrastructure/repositories/audit-log.repository.js";
import {
  type UserAuditContext,
  type UserAuditSink,
  CreateUserAccountUseCase,
  DeactivateUserUseCase,
  GetUserStatsUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  ReactivateUserUseCase,
  RevokeUserSessionsUseCase,
  UpdateUserAccountUseCase,
} from "../application/use-cases/user.use-cases.js";
import {
  AccountNotDeactivatedError,
  AccountSelfDeactivationError,
  LastAdminAccountError,
  LeadershipConflictError,
  UserManagementForbiddenError,
} from "../domain/errors/user.error.js";
import { DrizzleUserRepository } from "../infrastructure/repositories/user.repository.js";
import { SupabaseAdminAuthService } from "../infrastructure/supabase-admin.service.js";

const userRepository = new DrizzleUserRepository();

/**
 * Shared best-effort audit sink — records administrative actions in the
 * audit_logs table. Failures inside the sink never fail the primary action.
 */
const recordAuditLog = new RecordAuditLogUseCase(new DrizzleAuditLogRepository());

const auditSink: UserAuditSink = {
  record: (actor, input) => recordAuditLog.execute(actor, input),
};

/**
 * Builds the audit context from the verified session: who performed the
 * action and from which IP (FR-13.2). Returns undefined when no session
 * user is present (use-cases treat that as "skip audit", though management
 * endpoints always have one).
 */
function auditContext(req: Request): UserAuditContext | undefined {
  const user = req.sessionUser;
  if (!user) return undefined;
  return {
    auditSink,
    actor: { id: user.id, email: user.email },
    ipAddress: req.ip ?? null,
  };
}

/**
 * Supabase Admin API adapter (BR-008 credential management).
 * Uses SUPABASE_SERVICE_ROLE_KEY to create/reset credentials in Supabase
 * Auth; the local `users` table mirrors roles & member links.
 */
const supabaseAdminService = new SupabaseAdminAuthService();

/**
 * BR-008 double guard: middleware scope check + explicit session check.
 */
function assertManagementPermission(req: Request): void {
  const user = req.sessionUser;
  if (!user) {
    throw new UserManagementForbiddenError("Authentication required");
  }
  const allowed =
    user.globalRoles.includes("SUPER_ADMIN") || user.globalRoles.includes("CHAIRPERSON");
  if (!allowed) {
    throw new UserManagementForbiddenError();
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const input = createUserSchema.parse(req.body);
    const useCase = new CreateUserAccountUseCase(
      userRepository,
      supabaseAdminService,
      auditContext(req)
    );
    const user = await useCase.execute({ ...input, memberId: input.memberId ?? null });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const input = updateUserSchema.parse(req.body);
    const useCase = new UpdateUserAccountUseCase(
      userRepository,
      supabaseAdminService,
      auditContext(req)
    );
    const user = await useCase.execute(req.params.id as string, input);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    handleError(res, error);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    resetPasswordSchema.parse(req.body);
    // 404 early if the local user doesn't exist, before touching Supabase.
    const getUser = new GetUserUseCase(userRepository);
    const user = await getUser.execute(req.params.id as string);
    await supabaseAdminService.updatePassword(req.params.id as string, req.body.newPassword);

    if (req.sessionUser) {
      await recordAuditLog.execute(
        { id: req.sessionUser.id, email: req.sessionUser.email },
        {
          action: "PASSWORD_RESET",
          resourceType: "user",
          resourceId: user.id,
          payloadDiff: `email=${user.email}`,
          ipAddress: req.ip,
        }
      );
    }

    res.status(200).json({ success: true, message: "Password has been reset" });
  } catch (error) {
    handleError(res, error);
  }
}

export async function deactivateUser(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const useCase = new DeactivateUserUseCase(
      userRepository,
      supabaseAdminService,
      auditContext(req)
    );
    // PE-06: pass the acting admin's id so the self-deactivation guard
    // rail can reject lockout attempts.
    await useCase.execute(req.params.id as string, req.sessionUser?.id);
    res.status(200).json({ success: true, message: "User deactivated" });
  } catch (error) {
    handleError(res, error);
  }
}

/** PE-01 / FR-13.6: restore a deactivated account. */
export async function reactivateUser(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const useCase = new ReactivateUserUseCase(
      userRepository,
      supabaseAdminService,
      auditContext(req)
    );
    await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, message: "User reactivated" });
  } catch (error) {
    handleError(res, error);
  }
}

/** PE-08 / FR-13.13: force sign-out of a user's live sessions. */
export async function revokeUserSessions(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const useCase = new RevokeUserSessionsUseCase(
      userRepository,
      supabaseAdminService,
      auditContext(req)
    );
    await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, message: "Sessions revoked" });
  } catch (error) {
    handleError(res, error);
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const statusParam = req.query.status;
    const status =
      statusParam === "ACTIVE" || statusParam === "DEACTIVATED" ? statusParam : undefined;
    const useCase = new ListUsersUseCase(userRepository);
    const result = await useCase.execute({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      search: req.query.search as string | undefined,
      role: req.query.role as string | undefined,
      status,
    });
    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        total: result.total,
        totalPages: Math.ceil(result.total / (Number(req.query.limit) || 20)),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
}

/** FR-13.4: authoritative account lifecycle counts for the Super Admin dashboard. */
export async function getUserStats(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const useCase = new GetUserStatsUseCase(userRepository);
    const stats = await useCase.execute();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    handleError(res, error);
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const useCase = new GetUserUseCase(userRepository);
    const user = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    handleError(res, error);
  }
}

function handleError(res: Response, error: unknown): void {
  const message = error instanceof Error ? error.message : "Unknown error";
  if (error instanceof AccountSelfDeactivationError) {
    res.status(409).json({ success: false, error: { code: "SELF_DEACTIVATION", message } });
  } else if (error instanceof LastAdminAccountError) {
    res.status(409).json({ success: false, error: { code: "LAST_ADMIN", message } });
  } else if (error instanceof AccountNotDeactivatedError) {
    res.status(409).json({ success: false, error: { code: "NOT_DEACTIVATED", message } });
  } else if (message.includes("BR-007")) {
    res.status(422).json({ success: false, error: { code: "BR_007_VIOLATION", message } });
  } else if (message.includes("already exists")) {
    res.status(409).json({ success: false, error: { code: "USER_EXISTS", message } });
  } else if (message.includes("not found")) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message } });
  } else if (message.includes("Only SUPER_ADMIN")) {
    res.status(403).json({ success: false, error: { code: "FORBIDDEN", message } });
  } else if (error instanceof LeadershipConflictError) {
    res.status(409).json({ success: false, error: { code: "LEADERSHIP_CONFLICT", message } });
  } else if (message.includes("BR-009")) {
    res.status(409).json({ success: false, error: { code: "LEADERSHIP_CONFLICT", message } });
  } else if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "SupabaseAdminServiceUnavailableError"
  ) {
    res.status(503).json({ success: false, error: { code: "PROVISIONING_UNAVAILABLE", message } });
  } else if (error instanceof UserManagementForbiddenError) {
    res.status(403).json({ success: false, error: { code: "FORBIDDEN", message } });
  } else if (typeof error === "object" && error !== null && "issues" in error) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message } });
  } else {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message } });
  }
}

export const usersMiddlewares = { requireAuth, requireScopePermission };
