import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const phoneSchema = z.string().min(10).max(20);
export const emailSchema = z.string().email();
export const dateSchema = z.string().datetime();

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export const dateRangeSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
