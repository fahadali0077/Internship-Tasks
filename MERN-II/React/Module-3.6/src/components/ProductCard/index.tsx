import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { StarRating } from "./StarRating";
import { WishlistButton } from "@/components/WishlistButton";

interface ProductCardProps extends Product {
  inCart: boolean;
  onToggleCart: (product: Product) => void;
}

const BADGE_CLASS: Record<NonNullable<Product["badge"]>, string> = {
  New: "badge--new",
  Sale: "badge--sale",
  Hot: "badge--hot",
};

/**
 * ProductCard — Module 3.6 update:
 *   - Card image + name wrapped in <Link to="/products/:id">
 *     so clicking navigates to ProductDetailPage where useParams reads the id.
 *   - "Add to Cart" button stops propagation so clicking it doesn't also
 *     navigate to the detail page.
 */
export function ProductCard({
  id, name, price, originalPrice, image, rating, reviewCount,
  category, badge, inCart, onToggleCart,
  ...rest
}: ProductCardProps) {
  const product: Product = { id, name, price, originalPrice, image, rating, reviewCount, category, badge, ...rest };

  const discount =
    originalPrice != null
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <article className={`product-card ${inCart ? "product-card--in-cart" : ""}`}>
      {badge && (
        <span className={`badge ${BADGE_CLASS[badge]}`}>{badge}</span>
      )}

      <WishlistButton product={product} />

      {/* ── Clicking the image navigates to /products/:id ── */}
      <Link to={`/products/${id}`} className="card-image-link" tabIndex={-1} aria-hidden="true">
        <div className="card-image-wrap">
          <img src={image} alt={name} className="card-image" loading="lazy" />
          {inCart && (
            <div className="cart-overlay" aria-hidden="true">✓ Added</div>
          )}
        </div>
      </Link>

      <div className="card-body">
        <p className="card-category">{category}</p>

        {/* ── Clicking the name also navigates to /products/:id ── */}
        <Link to={`/products/${id}`} className="card-name-link">
          <h2 className="card-name">{name}</h2>
        </Link>

        <StarRating rating={rating} reviewCount={reviewCount} />

        <div className="card-pricing">
          <span className="price-current">${price.toFixed(2)}</span>
          {originalPrice != null && (
            <>
              <span className="price-original">${originalPrice.toFixed(2)}</span>
              <span className="price-discount">−{discount ?? 0}%</span>
            </>
          )}
        </div>

        {/* stopPropagation prevents the card link from also firing */}
        <button
          className={`btn-cart ${inCart ? "btn-cart--added" : ""}`}
          onClick={(e) => { e.preventDefault(); onToggleCart(product); }}
          aria-pressed={inCart}
          aria-label={inCart ? `Remove ${name} from cart` : `Add ${name} to cart`}
        >
          {inCart ? "✓  In Cart" : "+ Add to Cart"}
        </button>
      </div>
    </article>
  );
}
