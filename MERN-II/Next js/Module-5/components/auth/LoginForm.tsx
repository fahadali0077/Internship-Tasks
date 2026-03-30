"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginSchema, type LoginFormValues } from "@/schemas/auth";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    try {
      // Simulate API call — replaced by NextAuth signIn() in Module 6
      await new Promise((res) => setTimeout(res, 800));
      console.log("Login:", data);
      setSubmitted(true);
    } catch {
      setSubmitError("Invalid credentials. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600 dark:bg-green-900/30">
          ✓
        </div>
        <h3 className="font-serif text-xl">Signed in successfully</h3>
        <p className="text-sm text-ink-muted">
          NextAuth.js integration coming in Module 6.
        </p>
        <Button variant="outline" onClick={() => { setSubmitted(false); }}>
          Sign in again
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
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
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

        {/* Password */}
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
                    placeholder="Your password"
                    autoComplete="current-password"
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit error banner */}
        {submitError && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
            role="alert"
          >
            {submitError}
          </div>
        )}

        {/* Hint */}
        <p className="rounded-lg border border-amber/30 bg-amber-dim px-4 py-3 text-xs leading-relaxed text-amber dark:bg-amber/10">
          💡 <strong>Module 5:</strong> Enter any valid email + 8-char password to test validation. Full auth in Module 6.
        </p>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" /> Signing in…</>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          No account?{" "}
          <Link href="/auth/register" className="font-semibold text-amber hover:underline">
            Register →
          </Link>
        </p>
      </form>
    </Form>
  );
}
