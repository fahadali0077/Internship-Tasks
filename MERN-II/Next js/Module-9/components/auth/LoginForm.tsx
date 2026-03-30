"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginSchema, type LoginFormValues } from "@/schemas/auth";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/actions/cart";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Where to redirect after login (set by middleware via ?from=/cart)
  const from = searchParams.get("from") ?? "/products";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    const result = await loginAction(data.email, data.password);
    if (result.success) {
      router.push(from);   // redirect back to the protected page
      router.refresh();    // re-fetch server components with the new session
    } else {
      setSubmitError(result.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }} className="flex flex-col gap-5" noValidate>
        {from !== "/products" && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            Sign in to continue to <strong>{from}</strong>
          </div>
        )}

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Your password" autoComplete="current-password" className="pr-10" {...field} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:hover:text-white"
                  onClick={() => { setShowPassword((v) => !v); }} aria-label={showPassword ? "Hide" : "Show"}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400" role="alert">
            {submitError}
          </div>
        )}

        <p className="rounded-lg border border-amber/30 bg-amber-dim px-4 py-3 text-xs leading-relaxed text-amber dark:bg-amber/10">
          💡 Enter any valid email + 8-char password. Session cookie is set on the server.
        </p>

        <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" /> Signing in…</>
          ) : "Sign In"}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          No account?{" "}
          <Link href="/auth/register" className="font-semibold text-amber hover:underline">Register →</Link>
        </p>
      </form>
    </Form>
  );
}
