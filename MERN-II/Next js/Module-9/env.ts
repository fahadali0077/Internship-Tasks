import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";


export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // MongoDB connection (required in MERN-III, optional now)
    DATABASE_URL: z
      .string()
      .url("DATABASE_URL must be a valid MongoDB connection string")
      .optional(),

    // NextAuth (required in MERN-IV, optional now)
    NEXTAUTH_SECRET: z
      .string()
      .min(32, "NEXTAUTH_SECRET must be at least 32 characters")
      .optional(),

    NEXTAUTH_URL: z.string().url().optional(),
  },

  /**
   * Client-side environment variables.
   * MUST start with NEXT_PUBLIC_ to be exposed to the browser.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .url("NEXT_PUBLIC_BASE_URL must be a valid URL")
      .default("http://localhost:3000"),

    NEXT_PUBLIC_APP_NAME: z
      .string()
      .default("MERNShop"),
  },

  /**
   * runtimeEnv — maps schema keys to actual process.env values.
   * t3-env validates THESE values, not process.env directly.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  /**
   * skipValidation: disable validation in CI or when building Docker images
   * where env vars aren't available yet.
   * Set SKIP_ENV_VALIDATION=true to skip.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * emptyStringAsUndefined: treat "" the same as undefined.
   * Prevents bugs from empty-string env vars.
   */
  emptyStringAsUndefined: true,
});
