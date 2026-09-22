import { z } from "zod";
import { emailSchema, uuidSchema } from "./common.js";

/**
 * Leadership roles that require a linked member (BR-007).
 */
export const leadershipRoles = [
  "SUPER_ADMIN",
  "CHAIRPERSON",
  "SUB_CHAIRPERSON",
  "SECRETARY",
] as const;

export const assignableRoles = [...leadershipRoles, "MEMBER_REGULAR"] as const;

export const roleSchema = z.enum(assignableRoles);

/**
 * BR-007: leadership roles require a member link.
 */
export const createUserSchema = z
  .object({
    name: z.string().min(1).max(255),
    email: emailSchema,
    password: z.string().min(8).max(72),
    role: roleSchema,
    /** Required when role is a leadership role (BR-007). */
    memberId: uuidSchema.optional(),
    subDepartmentIds: z.array(uuidSchema).optional(),
    imageUrl: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    const leadership = leadershipRoles.includes(data.role as (typeof leadershipRoles)[number]);
    if (leadership && !data.memberId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["memberId"],
        message:
          "BR-007: leadership accounts must be linked to a registered member (memberId is required)",
      });
    }
  });

export const updateUserSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    email: emailSchema.optional(),
    role: roleSchema.optional(),
    memberId: uuidSchema.nullable().optional(),
    subDepartmentIds: z.array(uuidSchema).optional(),
    imageUrl: z.string().url().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role) {
      const leadership = leadershipRoles.includes(data.role as (typeof leadershipRoles)[number]);
      if (leadership && data.memberId === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["memberId"],
          message:
            "BR-007: leadership accounts must be linked to a registered member (memberId cannot be null)",
        });
      }
    }
  });

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(72),
});

export const userResponseSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  memberId: uuidSchema.nullable(),
  emailVerified: z.boolean(),
  image: z.string().url().nullable(),
  status: z.enum(["ACTIVE", "DEACTIVATED"]),
  deactivatedAt: z.string().datetime().nullable(),
  subDepartments: z.array(
    z.object({
      subDepartmentId: uuidSchema,
      code: z.string(),
      nameEn: z.string(),
      role: z.string(),
    })
  ),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
