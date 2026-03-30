import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";
import { SHIMMER_BLUR } from "@/lib/imageUtils";

export const metadata: Metadata = {
  title: "Module-7",
  description: "MERNShop — Module 7: SEO, next/font, next/image, sitemap, streaming.",
  openGraph: {
    title: "MERNShop — Production Next.js Storefront",
    description: "Built with Next.js 15, TypeScript, Tailwind CSS.",
  },
};

export default async function HomePage() {
  const products = await fetchProducts();
  // Featured products for the hero grid (first 4)
  const featured = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {/* Hero */}
      <section className="grid gap-10 py-8 md:py-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-amber">
            Module 7 — SEO-Optimised Product Catalogue
          </p>
          <h1 className="mb-6 font-serif text-4xl font-normal leading-[1.05] tracking-tight dark:text-white md:text-5xl lg:text-6xl">
            SEO-Optimised<br />
            <span className="text-amber">Product Catalogue</span>
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-ink-soft dark:text-ink-muted md:text-lg">
            Playfair Display headings via next/font, per-row Suspense streaming,
            blur placeholders on all images, and auto-generated sitemap.xml.
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
                priority={i < 2}            // preload only first 2 (above fold)
                placeholder="blur"
                blurDataURL={SHIMMER_BLUR}
                sizes="(max-width: 768px) 45vw, 200px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
