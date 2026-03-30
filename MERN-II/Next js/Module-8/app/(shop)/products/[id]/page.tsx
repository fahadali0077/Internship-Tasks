import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById, fetchProductIds } from "@/lib/products";
import { buildProductMetadata } from "@/lib/metadata";
import { SHIMMER_BLUR, DETAIL_IMAGE_SIZES } from "@/lib/imageUtils";
import { StarRating } from "@/components/products/StarRating";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ImageGallery } from "@/components/products/ImageGallery";
import { Badge } from "@/components/ui/badge";

/**
 * generateStaticParams — SSG for all product pages.
 * At build time, Next.js pre-renders /products/p-001 … /products/p-012.
 */
export async function generateStaticParams() {
  const ids = await fetchProductIds();
  return ids.map((id) => ({ id }));
}

/**
 * generateMetadata — dynamic SEO metadata per product.
 *
 * Module 7 improvement over Module 6:
 *   - Now uses buildProductMetadata() from lib/metadata.ts
 *   - Includes Open Graph image (product's actual photo)
 *   - Includes Twitter card metadata
 *   - Description falls back to a generated string if no product.description
 *
 * When to verify:
 *   Open Graph Debugger: https://developers.facebook.com/tools/debug/
 *   Twitter Card Validator: https://cards-dev.twitter.com/validator
 *   Or use: curl -I http://localhost:3000/products/p-001 and check headers
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) return { title: "Product not found" };
  return buildProductMetadata(product);
}

const BADGE_VARIANT = { Sale: "sale", New: "new", Hot: "hot" } as const;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) notFound();

  const discount = product.originalPrice != null
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="pb-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <Link href="/" className="text-ink-muted transition-colors hover:text-amber">Home</Link>
        <span className="text-border">›</span>
        <Link href="/products" className="text-ink-muted transition-colors hover:text-amber">Products</Link>
        <span className="text-border">›</span>
        <span className="max-w-[200px] truncate font-medium text-ink dark:text-white">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        {/* ImageGallery — Client Component (useState) */}
        <ImageGallery product={product} />

        {/* Info — Server Component */}
        <div className="flex flex-col gap-5">
          {product.badge && (
            <div><Badge variant={BADGE_VARIANT[product.badge]}>{product.badge}</Badge></div>
          )}
          <p className="text-xs font-semibold uppercase tracking-widest text-amber">
            {product.category}
          </p>

          {/* Playfair Display heading */}
          <h1 className="font-serif text-3xl font-normal leading-tight dark:text-white md:text-4xl">
            {product.name}
          </h1>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-bold tabular-nums dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice != null && (
              <>
                <span className="text-lg tabular-nums text-ink-muted line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {product.description && (
            <p className="leading-relaxed text-ink-soft dark:text-ink-muted">
              {product.description}
            </p>
          )}

          {/* Structured data — JSON-LD for Google Shopping */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.description ?? "",
                image: product.image,
                offers: {
                  "@type": "Offer",
                  price: product.price,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: product.rating,
                  reviewCount: product.reviewCount,
                },
              }),
            }}
          />

          <div className="flex flex-col gap-3 pt-2">
            <AddToCartButton product={product} />
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink-soft transition-all hover:border-ink hover:text-ink dark:border-dark-border dark:bg-dark-surface dark:text-white dark:hover:border-white"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
