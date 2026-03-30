import type { Metadata } from "next";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Module-4",
  description: "Welcome to MERNShop — Next.js 15 App Router capstone.",
};

export default async function HomePage() {
  // Parallel fetch — runs concurrently, not sequentially
  // In a real app you'd fetch hero content, featured products, etc. in parallel
  const products = await fetchProducts();

  const stats = [
    { label: "Products", value: products.length },
    { label: "Categories", value: 5 },
    { label: "Next.js", value: 15 },
  ];

  return (
    <div className="flex flex-col gap-20">
      {/* ── Hero ── */}
      <section className="grid gap-12 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-amber">
            Module 4 — Next.js App Shell
          </p>
          <h1 className="mb-6 font-serif text-5xl font-normal leading-[1.05] tracking-tight lg:text-6xl">
            The Production<br />
            <span className="text-amber">React Framework</span>
          </h1>
          <p className="mb-10 max-w-lg text-lg leading-relaxed text-ink-soft">
            Server Components, file-system routing, Suspense streaming,
            and Tailwind CSS — migrated from the Vite SPA built in Modules 1–3.5.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center rounded-lg bg-ink px-7 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-ink-soft hover:shadow-sm"
            >
              Browse Products →
            </Link>

          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-xl border border-border bg-white p-6 text-center shadow-sm"
            >
              <span className="font-serif text-3xl font-normal text-amber">{s.value}</span>
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
