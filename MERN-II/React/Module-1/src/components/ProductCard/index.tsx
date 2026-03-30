import type { Product } from "@/types";
import { StarRating } from "./StarRating";


interface ProductCardProps extends Product {
  inCart: boolean;
  onToggleCart: (id: string) => void;
}

// ─── Badge colours ────────────────────────────────────────────────────────────
const BADGE_CLASS: Record<NonNullable<Product["badge"]>, string> = {
  New: "badge--new",
  Sale: "badge--sale",
  Hot: "badge--hot",
};

// ─── Component ───────────────────────────────────────────────────────────────
export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  category,
  badge,
  inCart,
  onToggleCart,
}: ProductCardProps) {
  const discount =
    originalPrice != null
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <article className={`product-card ${inCart ? "product-card--in-cart" : ""}`}>
      {/* ── Badge ── */}
      {badge && (
        <span className={`badge ${BADGE_CLASS[badge]}`}>{badge}</span>
      )}

      {/* ── Image ── */}
      <div className="card-image-wrap">
        <img
          src={image}
          alt={name}
          className="card-image"
          loading="lazy"
        />
        {/* Cart state overlay indicator */}
        {inCart && (
          <div className="cart-overlay" aria-hidden="true">
            ✓ Added
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="card-body">
        <p className="card-category">{category}</p>
        <h2 className="card-name">{name}</h2>

        <StarRating rating={rating} reviewCount={reviewCount} />

        {/* ── Pricing ── */}
        <div className="card-pricing">
          <span className="price-current">${price.toFixed(2)}</span>
          {originalPrice != null && (
            <>
              <span className="price-original">${originalPrice.toFixed(2)}</span>
              <span className="price-discount">−{discount ?? 0}%</span>
            </>
          )}
        </div>

        {/* ── CTA ── */}
        {/*
          onClick calls the LIFTED handler with this card's id.
          The parent (App) owns the Set; the child just signals intent.
          This is the canonical React "lifting state up" pattern.
        */}
        <button
          className={`btn-cart ${inCart ? "btn-cart--added" : ""}`}
          onClick={() => { onToggleCart(id); }}
          aria-pressed={inCart}
          aria-label={inCart ? `Remove ${name} from cart` : `Add ${name} to cart`}
        >
          {inCart ? "✓  Remove from Cart" : "+ Add to Cart"}
        </button>
      </div>
    </article>
  );
}
