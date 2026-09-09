import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .default("3001"),
  DATABASE_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default("*"),
  API_PREFIX: z.string().default("/api/v1"),
  AUTH_SECRET: z
    .string()
    .min(16, "AUTH_SECRET must be at least 16 characters")
    .default("dev-secret-change-in-production-16chars"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  API_PREFIX: process.env.API_PREFIX,
  AUTH_SECRET: process.env.AUTH_SECRET,
});
