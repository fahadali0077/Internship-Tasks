import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById, fetchProductIds } from "@/lib/products";
import { StarRating } from "@/components/products/StarRating";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { Badge } from "@/components/ui/badge";

// ── generateStaticParams ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  const ids = await fetchProductIds();
  return ids.map((id) => ({ id }));
}

// ── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description ?? `Buy ${product.name} at the best price.`,
    openGraph: {
      title: product.name,
      images: [{ url: product.image }],
    },
  };
}

// ── Page Component ───────────────────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  // notFound() throws a special Next.js error that renders not-found.tsx
  if (!product) notFound();

  const discount =
    product.originalPrice != null
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const BADGE_VARIANT = { Sale: "sale", New: "new", Hot: "hot" } as const;

  return (
    <div className="pb-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <Link href="/" className="text-ink-muted transition-colors hover:text-amber">Home</Link>
        <span className="text-border">›</span>
        <Link href="/products" className="text-ink-muted transition-colors hover:text-amber">Products</Link>
        <span className="text-border">›</span>
        <span className="max-w-[200px] truncate font-medium text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-cream">
          {product.badge && (
            <div className="absolute left-4 top-4 z-10">
              <Badge variant={BADGE_VARIANT[product.badge]}>{product.badge}</Badge>
            </div>
          )}
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber">
            {product.category}
          </p>
          <h1 className="font-serif text-4xl font-normal leading-tight">
            {product.name}
          </h1>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          {/* Pricing */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-bold tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice != null && (
              <>
                <span className="text-lg tabular-nums text-ink-muted line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-bold text-green-700">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="leading-relaxed text-ink-soft">{product.description}</p>
          )}

          {/* CTA — Client Component island */}
          <div className="flex flex-col gap-3 pt-2">
            <AddToCartButton product={product} />
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink-soft transition-all hover:border-ink hover:text-ink"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
