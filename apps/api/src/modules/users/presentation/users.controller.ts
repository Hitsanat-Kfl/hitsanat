import type { Request, Response } from "express";
import { requireAuth, requireScopePermission } from "@repo/auth";
import { createUserSchema, resetPasswordSchema, updateUserSchema } from "@repo/validation";
import {
  CreateUserAccountUseCase,
  DeactivateUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  UpdateUserAccountUseCase,
} from "../application/use-cases/user.use-cases.js";
import {
  LeadershipConflictError,
  UserManagementForbiddenError,
} from "../domain/errors/user.error.js";
import { DrizzleUserRepository } from "../infrastructure/repositories/user.repository.js";
import { SupabaseAdminAuthService } from "../infrastructure/supabase-admin.service.js";

const userRepository = new DrizzleUserRepository();

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
    const useCase = new CreateUserAccountUseCase(userRepository, supabaseAdminService);
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
    const useCase = new UpdateUserAccountUseCase(userRepository, supabaseAdminService);
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
    await getUser.execute(req.params.id as string);
    await supabaseAdminService.updatePassword(req.params.id as string, req.body.newPassword);
    res.status(200).json({ success: true, message: "Password has been reset" });
  } catch (error) {
    handleError(res, error);
  }
}

export async function deactivateUser(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const useCase = new DeactivateUserUseCase(userRepository, supabaseAdminService);
    await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, message: "User deactivated" });
  } catch (error) {
    handleError(res, error);
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    assertManagementPermission(req);
    const useCase = new ListUsersUseCase(userRepository);
    const result = await useCase.execute({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      search: req.query.search as string | undefined,
      role: req.query.role as string | undefined,
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
  if (message.includes("BR-007")) {
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
