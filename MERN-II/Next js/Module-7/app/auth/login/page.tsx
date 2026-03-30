import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-8">
      <div className="rounded-2xl border border-border bg-white p-10 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="mb-8 text-center">
          <span className="mb-3 block text-4xl text-amber">◈</span>
          <h1 className="font-serif text-3xl font-normal dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-muted">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
