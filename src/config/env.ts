import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/parho"),
  AUTH_SESSION_SECRET: z.string().default("parho-super-secret-jwt-key-2026-development-change-in-prod"),
});

export function getEnv() {
  return envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/parho",
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET || "parho-super-secret-jwt-key-2026-development-change-in-prod",
  });
}
