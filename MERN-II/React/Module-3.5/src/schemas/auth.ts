import { z } from "zod";

/**
 * RegisterSchema — Zod schema for the registration form.
 *
 * MENTAL MODEL — Zod's role in the stack:
 *
 *   React Hook Form handles form state and validation triggers.
 *   Zod defines WHAT is valid — the rules.
 *   @hookform/resolvers/zod bridges them: RHF calls Zod on each submit/change.
 *
 *   The big win: one schema for BOTH form validation AND TypeScript types.
 *   z.infer<typeof RegisterSchema> gives you the TypeScript type for free —
 *   no duplication between your Zod schema and your interface.
 *
 *   In Module 8, the same Zod schemas validate API request bodies on the
 *   server side too — a single source of truth for the whole stack.
 *
 * Validation rules (per curriculum):
 *   name:            required, 2–50 chars
 *   email:           valid email format
 *   password:        min 8 chars, must contain a letter and a number
 *   confirmPassword: must match password
 */
export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be under 50 characters")
      .trim(),

    email: z
      .string()
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),

    // Optional file input — validated separately via useRef (uncontrolled)
    // We don't include avatar in the Zod schema because FileList is not
    // serialisable. It's handled as an uncontrolled input with useRef.
  })
  .refine((data) => data.password === data.confirmPassword, {
    // Cross-field validation using .refine() — runs after all individual fields pass
    message: "Passwords do not match",
    path: ["confirmPassword"], // which field the error is attached to
  });

// Infer TypeScript type from the Zod schema — no manual interface needed
export type RegisterFormValues = z.infer<typeof RegisterSchema>;

// ─── LoginSchema ──────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
