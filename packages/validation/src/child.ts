import { z } from "zod";
import { dateSchema, phoneSchema, uuidSchema } from "./common.js";

export const childRegistrationSchema = z.object({
  fullName: z.string().min(1).max(255),
  christianName: z.string().min(1).max(255),
  gender: z.enum(["Male", "Female"]),
  dateOfBirth: z.string().date(),
  address: z.string().min(1),
  kutrGroup: z.enum(["Kutr 1", "Kutr 2"]),
  collectionLocation: z.enum(["Apartama", "Gende Boy", "Gende Je", "Cobalt", "Bate"]),
  photoUrl: z.string().url().optional(),
});

export const childResponseSchema = z.object({
  id: uuidSchema,
  fullName: z.string(),
  christianName: z.string(),
  gender: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
  kutrGroup: z.string(),
  collectionLocation: z.string(),
  photoUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: dateSchema,
});

export const parentSchema = z.object({
  fullName: z.string().min(1).max(255),
  phoneNumber: phoneSchema,
  secondaryPhone: phoneSchema.optional(),
  address: z.string().min(1),
  occupation: z.string().max(128).optional(),
  notes: z.string().optional(),
});

export const parentResponseSchema = z.object({
  id: uuidSchema,
  fullName: z.string(),
  phoneNumber: z.string(),
  secondaryPhone: z.string().nullable(),
  address: z.string(),
  occupation: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: dateSchema,
});

export const childParentLinkSchema = z.object({
  parentId: uuidSchema,
  relation: z.enum(["Father", "Mother"]),
});

export type ChildRegistrationInput = z.infer<typeof childRegistrationSchema>;
export type ChildResponse = z.infer<typeof childResponseSchema>;
export type ParentInput = z.infer<typeof parentSchema>;
export type ParentResponse = z.infer<typeof parentResponseSchema>;
export type ChildParentLinkInput = z.infer<typeof childParentLinkSchema>;
