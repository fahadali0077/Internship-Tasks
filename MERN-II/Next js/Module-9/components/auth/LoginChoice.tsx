"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Shield, ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

type Choice = null | "customer";

export function LoginChoice() {
  const [choice, setChoice] = useState<Choice>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const router = useRouter();

  const goAdmin = () => {
    setAdminLoading(true);
    router.push("/admin/login");
  };

  /* ── Choice screen ────────────────────────────────────────────────────── */
  if (choice === null) {
    return (
      <>
        <div className="mb-8 text-center">
          <span className="mb-3 block text-4xl text-amber">◈</span>
          <h1 className="font-serif text-3xl font-normal dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-muted">How would you like to sign in?</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Customer card */}
          <button
            onClick={() => { setChoice("customer"); }}
            className="group flex items-center gap-4 rounded-xl border border-border bg-parchment p-5 text-left transition-all hover:border-amber hover:shadow-sm dark:border-dark-border dark:bg-dark-surface-2 dark:hover:border-amber"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber transition-colors group-hover:bg-amber group-hover:text-white">
              <ShoppingBag size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink dark:text-white">Customer Login</p>
              <p className="mt-0.5 text-xs text-ink-muted">Shop, track orders & manage your cart</p>
            </div>
            <ArrowRight size={16} className="text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-amber" />
          </button>

          {/* Admin card */}
          <button
            onClick={goAdmin}
            disabled={adminLoading}
            className="group flex items-center gap-4 rounded-xl border border-border bg-parchment p-5 text-left transition-all hover:border-amber hover:shadow-sm disabled:opacity-60 dark:border-dark-border dark:bg-dark-surface-2 dark:hover:border-amber"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber transition-colors group-hover:bg-amber group-hover:text-white">
              {adminLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Shield size={20} />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink dark:text-white">Admin Login</p>
              <p className="mt-0.5 text-xs text-ink-muted">Manage products, orders & analytics</p>
            </div>
            <ArrowRight size={16} className="text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-amber" />
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-5 text-center text-sm text-ink-muted dark:border-dark-border">
          No account?{" "}
          <Link href="/auth/register" className="font-semibold text-amber hover:underline">
            Register →
          </Link>
        </div>
      </>
    );
  }

  /* ── Customer login form ──────────────────────────────────────────────── */
  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => { setChoice(null); }}
          className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-amber"
        >
          <ChevronLeft size={15} />
          Back
        </button>
        <div className="text-center">
          <span className="mb-3 block text-4xl text-amber">◈</span>
          <h1 className="font-serif text-3xl font-normal dark:text-white">Customer Login</h1>
          <p className="mt-2 text-sm text-ink-muted">Sign in to your account</p>
        </div>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
