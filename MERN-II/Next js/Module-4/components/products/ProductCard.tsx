import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { StarRating } from "./StarRating";
import { AddToCartButton } from "./AddToCartButton";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const BADGE_VARIANT = {
  Sale: "sale",
  New: "new",
  Hot: "hot",
} as const;

export function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.originalPrice != null
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[14px] border border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border">
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-10">
          <Badge variant={BADGE_VARIANT[product.badge]}>
            {product.badge}
          </Badge>
        </div>
      )}

      {/* Image — links to detail page */}
      <Link href={`/products/${product.id}`} className="block overflow-hidden bg-cream">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber">
          {product.category}
        </p>

        <Link href={`/products/${product.id}`} className="group/link">
          <h2 className="line-clamp-2 font-serif text-[1.05rem] leading-snug text-ink transition-colors group-hover/link:text-amber">
            {product.name}
          </h2>
        </Link>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        {/* Pricing */}
        <div className="mt-auto flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-bold tabular-nums text-ink">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice != null && (
            <>
              <span className="text-sm tabular-nums text-ink-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-700">
                −{discount ?? 0}%
              </span>
            </>
          )}
        </div>

        {/* Client Component island — only this button is hydrated */}
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
