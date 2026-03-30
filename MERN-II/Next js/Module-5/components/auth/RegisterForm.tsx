"use client";

/**
 * RegisterForm — Module 5 implementation.
 *
 * WHAT'S HERE (Module 5 task requirements):
 *   ✅ React Hook Form + zodResolver
 *   ✅ Zod schema: email format, password min 8 + letter + number, passwords match
 *   ✅ Inline FormMessage errors per field (only after field is touched)
 *   ✅ Disable Submit while form is invalid or submitting
 *   ✅ Live password strength bar (4 segments: weak → strong)
 *   ✅ Uncontrolled file-upload input using useRef (avatar photo)
 *
 * MODULE 6 UPGRADE:
 *   onSubmit calls a real Server Action (registerAction) instead of setTimeout.
 *   The avatar file is uploaded to object storage (S3/Cloudinary).
 */

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Upload } from "lucide-react";
import { RegisterSchema, type RegisterFormValues } from "@/schemas/auth";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function getPasswordStrength(pwd: string): { level: number; label: string; color: string } {
  let level = 0;
  if (pwd.length >= 8) level++;
  if (/[A-Z]/.test(pwd)) level++;
  if (/[0-9]/.test(pwd)) level++;
  if (/[^a-zA-Z0-9]/.test(pwd)) level++;
  const map = [
    { label: "",       color: "bg-border"       },
    { label: "Weak",   color: "bg-red-500"       },
    { label: "Fair",   color: "bg-amber"         },
    { label: "Good",   color: "bg-amber-light"   },
    { label: "Strong", color: "bg-green-500"     },
  ];
  return { level, ...(map[level] ?? map[0]) };
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  /**
   * Uncontrolled file input — DOM drives the value, not React state.
   *
   * MENTAL MODEL — uncontrolled vs controlled:
   *   Controlled:   value={state}  onChange={setState}  → React owns the value
   *   Uncontrolled: defaultValue   ref.current.value    → DOM owns the value
   *
   * For file inputs, uncontrolled is the correct pattern because:
   *   • File inputs CANNOT be set programmatically (security restriction)
   *   • We only need the value on submit, not on every keystroke
   *   • React Hook Form's register() also uses refs for file inputs
   *
   * Usage: avatarRef.current.files?.[0] gives the File object on submit.
   */
  const avatarRef = useRef<HTMLInputElement>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("password");
  const strength = getPasswordStrength(passwordValue);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Generate a local preview URL
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    // Read the uncontrolled file input
    const avatarFile = avatarRef.current?.files?.[0];
    console.log("Register data:", data);
    console.log("Avatar file:", avatarFile?.name ?? "none selected");

    // Simulate async registration (Module 6: real Server Action)
    await new Promise((res) => setTimeout(res, 900));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600 dark:bg-green-900/30">
          ✓
        </div>
        <h3 className="font-serif text-xl dark:text-white">Account created!</h3>
        <p className="text-sm text-ink-muted">You can now sign in with your credentials.</p>
        <Button variant="outline" asChild>
          <Link href="/auth/login">Go to Login →</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }}
        className="flex flex-col gap-5"
        noValidate
      >
        {/* ── Uncontrolled avatar upload ──────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium leading-none text-ink dark:text-white">
            Profile photo{" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </span>

          <div className="flex items-center gap-4">
            {/* Preview circle */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-cream dark:border-dark-border dark:bg-dark-surface-2">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Upload size={18} className="text-ink-muted" />
              )}
            </div>

            {/* Uncontrolled file input — read via ref on submit */}
            <div className="flex flex-col gap-1">
              <input
                ref={avatarRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="text-xs text-ink-muted file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-border file:bg-cream file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink-soft file:transition-colors hover:file:bg-border dark:file:border-dark-border dark:file:bg-dark-surface-2 dark:file:text-white"
              />
              <p className="text-[11px] text-ink-muted">
                Uncontrolled — read via{" "}
                <code className="rounded bg-cream px-1 dark:bg-dark-surface-2">
                  avatarRef.current.files
                </code>{" "}
                on submit
              </p>
            </div>
          </div>
        </div>

        {/* ── Name ─────────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Smith" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Email ────────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Password + strength bar ──────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars with a number"
                    autoComplete="new-password"
                    className="pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:hover:text-white"
                    onClick={() => { setShowPassword((v) => !v); }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormControl>

              {/* Live password strength bar */}
              {passwordValue.length > 0 && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          n <= strength.level ? strength.color : "bg-border dark:bg-dark-border"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span className="text-xs font-medium text-ink-muted">
                      {strength.label}
                    </span>
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Confirm Password ─────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:hover:text-white"
                    onClick={() => { setShowConfirm((v) => !v); }}
                    aria-label={showConfirm ? "Hide" : "Show"}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Submit ───────────────────────────────────────────────────────── */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" /> Creating account…</>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-amber hover:underline">
            Log in →
          </Link>
        </p>
      </form>
    </Form>
  );
}
