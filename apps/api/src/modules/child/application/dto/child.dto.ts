import type { z } from "zod";
import {
  childRegistrationSchema,
  type childResponseSchema,
  parentSchema,
  type parentResponseSchema,
  childParentLinkSchema,
} from "@repo/validation";

export type CreateChildDto = z.infer<typeof childRegistrationSchema>;
export const createChildDto = childRegistrationSchema;

export type UpdateChildDto = Partial<z.infer<typeof childRegistrationSchema>>;
export const updateChildDto = childRegistrationSchema.partial();

export type ChildResponseDto = z.infer<typeof childResponseSchema>;

export type CreateParentDto = z.infer<typeof parentSchema>;
export const createParentDto = parentSchema;

export type ParentResponseDto = z.infer<typeof parentResponseSchema>;

export type LinkParentDto = z.infer<typeof childParentLinkSchema>;
export const linkParentDto = childParentLinkSchema;
