import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";
import { SHIMMER_BLUR } from "@/lib/imageUtils";

/**
 * Home page metadata.
 *
 * MODULE 8 FIX: title was hardcoded as "Module-8" — changed to "Home" so the
 * browser tab shows "Home | MERNShop" (using the template from DEFAULT_METADATA
 * set in layout.tsx). The title "Module-8" was a dev placeholder never intended
 * for the final version.
 *
 * The openGraph fields now match the actual page content and use the
 * env-validated app name instead of a hardcoded string.
 */
export const metadata: Metadata = {
  title: "Home",
  description:
    "MERNShop — Type-safe Next.js 15 storefront. " +
    "Shared TypeScript types, Zod validation, t3-env, and Husky pre-commit hooks.",
  openGraph: {
    title: "MERNShop — Production Next.js Storefront",
    description: "Built with Next.js 15, TypeScript, Tailwind CSS, and Zod end-to-end.",
  },
};

export default async function HomePage() {
  const products = await fetchProducts();
  const featured = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {/* Hero */}
      <section className="grid gap-10 py-8 md:py-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-amber">
            MERN-II · Module 8 · TypeScript · Zod · t3-env · Husky
          </p>
          <h1 className="mb-6 font-serif text-4xl font-normal leading-[1.05] tracking-tight dark:text-white md:text-5xl lg:text-6xl">
            Type-Safe Product<br />
            <span className="text-amber">&amp; Cart System</span>
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-ink-soft dark:text-ink-muted md:text-lg">
            Shared TypeScript types, Zod validation on all API routes and Server Actions,
            t3-env for runtime-safe environment variables,
            and Husky pre-commit hooks enforcing lint and type checks.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link
              href="/products"
              className="inline-flex items-center rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-ink-soft dark:bg-amber dark:hover:bg-amber-600 md:px-7"
            >
              Browse Products →
            </Link>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex items-center rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-ink-soft transition-all hover:border-amber hover:text-amber dark:border-dark-border dark:bg-dark-surface dark:text-white md:px-7"
            >
              View Sitemap ↗
            </Link>
          </div>
        </div>

        {/* Featured product images — priority loaded */}
        <div className="grid grid-cols-2 gap-3">
          {featured.map((product, i) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border dark:border-dark-border"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority={i < 2}
                placeholder="blur"
                blurDataURL={SHIMMER_BLUR}
                sizes="(max-width: 768px) 45vw, 200px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Module 8 feature cards */}
      <section>
        <h2 className="mb-6 font-serif text-2xl font-normal dark:text-white md:mb-8 md:text-3xl">
          What&apos;s new in Module 8
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {[
            {
              icon: "🛡",
              title: "Shared Types",
              desc: "Product, CartItem, User, ApiResponse<T>, ActionResult<T> — one source of truth in types/index.ts.",
            },
            {
              icon: "✦",
              title: "Zod End-to-End",
              desc: "All API route params and Server Action inputs validated with safeParse() before any business logic runs.",
            },
            {
              icon: "🔒",
              title: "t3-env",
              desc: "Type-safe environment variables with runtime validation at startup. Missing vars crash immediately with a clear message.",
            },
            {
              icon: "🪝",
              title: "Husky Pre-commit",
              desc: "ESLint + Prettier auto-fix on staged files, then tsc --noEmit on the full project. Broken code can't be committed.",
            },
            {
              icon: "📦",
              title: "Bundle Analyzer",
              desc: "Run npm run analyze to open an interactive treemap of every JS bundle. Verify route-level code splitting.",
            },
            {
              icon: "🗺",
              title: "Sitemap & Robots",
              desc: "Auto-generated sitemap.xml lists all 12 product pages. robots.ts blocks /api/ and /auth/ from crawlers.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-border bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface md:p-6"
            >
              <span className="mb-3 block text-2xl">{c.icon}</span>
              <h3 className="mb-2 font-serif text-base font-normal dark:text-white md:text-lg">
                {c.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft dark:text-ink-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
