import type { Metadata } from "next";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Module-5",
  description: "MERNShop — Module 5: Framer Motion, Dark Mode, RHF + Zod.",
};

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {/* Hero */}
      <section className="grid gap-10 py-8 md:py-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-amber">
            Module 5 — Auth UI + Animated Product Page
          </p>
          <h1 className="mb-6 font-serif text-4xl font-normal leading-[1.05] tracking-tight dark:text-white md:text-5xl lg:text-6xl">
            The Production<br />
            <span className="text-amber">React Framework</span>
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-ink-soft dark:text-ink-muted md:text-lg">
            Animated cart drawer, image gallery, dark mode, mobile hamburger menu,
            and full form validation — all wired into the Next.js 15 shell.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link
              href="/products"
              className="inline-flex items-center rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-ink-soft dark:bg-amber dark:hover:bg-amber-600 md:px-7"
            >
              Browse Products →
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-ink-soft transition-all hover:border-amber hover:text-amber dark:border-dark-border dark:bg-dark-surface dark:text-white md:px-7"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {[
            { label: "Products", value: products.length },
            { label: "Module", value: 5 },
            { label: "Next.js", value: 15 },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-xl border border-border bg-white p-5 text-center shadow-sm dark:border-dark-border dark:bg-dark-surface md:p-6"
            >
              <span className="font-serif text-2xl font-normal text-amber md:text-3xl">{s.value}</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
