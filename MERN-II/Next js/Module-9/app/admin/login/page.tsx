"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package,
  TrendingUp, Shield, Zap, ArrowRight, Loader2,
} from "lucide-react";

// ── Left panel — brand / feature showcase ────────────────────────────────────
const FEATURES = [
  { icon: LayoutDashboard, label: "Real-time Dashboard",    desc: "Revenue & order stats at a glance" },
  { icon: TrendingUp,      label: "Live Order Feed",        desc: "Socket.IO streaming with Framer Motion" },
  { icon: Package,         label: "Products Table",         desc: "TanStack Table — sort, filter & paginate" },
  { icon: Zap,             label: "⌘K Command Palette",     desc: "Instant navigation between sections" },
];

const STAT_PILLS = [
  { value: "$24,830", label: "Today's Revenue" },
  { value: "142",     label: "Active Orders"   },
  { value: "98.2%",   label: "Uptime"          },
];

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0f0e0c] p-12 lg:flex lg:w-1/2">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#d97706 1px, transparent 1px), linear-gradient(90deg, #d97706 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-amber/10 blur-[100px]" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <span className="text-2xl text-amber">◈</span>
        <div>
          <p className="font-serif text-xl text-white">
            <span className="text-amber">MERN</span>Shop
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Admin Console
          </p>
        </div>
      </div>

      {/* Headline + features */}
      <div className="relative z-10 space-y-7">
        <div>
          <h2 className="font-serif text-4xl font-normal leading-tight text-white">
            Your store,<br />
            <span className="text-amber">fully in control.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Monitor revenue, manage inventory, and watch orders
            arrive live — all from one dashboard.
          </p>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-3">
          {STAT_PILLS.map(({ value, label }) => (
            <div key={label} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="block text-lg font-bold text-amber">{value}</span>
              <span className="text-[10px] text-white/40">{label}</span>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <ul className="space-y-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
                <Icon size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{label}</p>
                <p className="text-xs text-white/35">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center gap-2 text-xs text-white/25">
        <Shield size={11} />
        <span>Protected by edge middleware · Mock auth for MERN-II demo</span>
      </div>
    </div>
  );
}

// ── Right panel — login form ──────────────────────────────────────────────────
function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const expires = new Date(Date.now() + 86_400_000).toUTCString();
    document.cookie = `admin_session=mock_admin_token; expires=${expires}; path=/`;
    router.push(from);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-parchment px-6 dark:bg-dark-bg">
      {/* Mobile-only logo */}
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <span className="text-2xl text-amber">◈</span>
        <p className="font-serif text-xl">
          <span className="text-amber">MERN</span>Shop{" "}
          <span className="text-ink-muted">Admin</span>
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-normal text-ink dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Sign in to your admin account to continue
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-white/50">
                Email address
              </label>
              <input
                type="email"
                defaultValue="admin@mernshop.com"
                readOnly
                className="h-11 rounded-xl border border-border bg-parchment px-4 text-sm text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/10 dark:border-dark-border dark:bg-dark-surface-2 dark:text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-white/50">
                  Password
                </label>
                <button type="button" className="text-xs text-amber hover:underline" tabIndex={-1}>
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                defaultValue="password"
                readOnly
                className="h-11 rounded-xl border border-border bg-parchment px-4 text-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/10 dark:border-dark-border dark:bg-dark-surface-2 dark:text-white"
              />
            </div>

            <p className="rounded-xl border border-amber/20 bg-amber/5 px-4 py-3 text-xs leading-relaxed text-amber/80 dark:bg-amber/10">
              💡 Demo mode — click Sign In to proceed with mock credentials.
            </p>

            <button
              onClick={() => { void handleLogin(); }}
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Signing in…</>
              ) : (
                <>Sign in to Admin <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Not an admin?{" "}
          <Link href="/auth/login" className="font-semibold text-ink hover:text-amber dark:text-white dark:hover:text-amber">
            Sign in as a customer →
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-ink-muted">
          <Link href="/" className="hover:text-amber hover:underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
