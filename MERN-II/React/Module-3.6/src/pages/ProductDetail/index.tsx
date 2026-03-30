import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { StarRating } from "@/components/ProductCard/StarRating";

/**
 * ProductDetailPage — "/products/:id"
 *
 * MENTAL MODEL — useParams():
 *   React Router extracts the :id segment from the URL and provides it as
 *   a typed object. If the URL is /products/p-007, useParams() returns
 *   { id: "p-007" }. We then find the matching product in our cached data.
 *
 *   In a real app, you'd call a dedicated API: GET /api/products/p-007.
 *   Here we reuse the already-cached useProducts() result — the data is
 *   already in TanStack Query's cache from the /products page visit, so
 *   there's no network round-trip. This is a key caching benefit.
 *
 * NAVIGATION:
 *   Link to="/products" → declarative back navigation
 *   useNavigate() → imperative navigation after "Add to Cart"
 */
export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Reuse cached query — zero extra network request if /products was visited
  const { data, isLoading, error } = useProducts();
  const product = data?.find((p) => p.id === id);

  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(id ?? ""));

  const isInCart = cartItems.some((i) => i.product.id === id);

  const handleToggleCart = () => {
    if (!product) return;
    if (isInCart) {
      removeItem(product.id);
    } else {
      addItem(product, 1);
      openDrawer();
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="detail-page">
        <div className="detail-skeleton">
          <div className="skeleton skeleton--detail-img" />
          <div className="detail-skeleton-body">
            <div className="skeleton skeleton--title" style={{ height: 32, width: "70%" }} />
            <div className="skeleton skeleton--title" style={{ height: 20, width: "40%" }} />
            <div className="skeleton skeleton--price" style={{ height: 36, width: "120px" }} />
            <div className="skeleton skeleton--btn" style={{ height: 52 }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="detail-page">
        <div className="error-state">
          <span className="error-icon">⚠</span>
          <p className="error-title">Failed to load product</p>
          <p className="error-sub">{error.message}</p>
          <Link to="/products" className="btn-ghost" style={{ marginTop: "1rem", display: "inline-block" }}>
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  // ── 404 — id not found in data ──
  if (!product) {
    return (
      <div className="detail-page">
        <div className="not-found-state">
          <span className="nf-code">404</span>
          <h1 className="nf-title">Product not found</h1>
          <p className="nf-sub">No product with id <code>"{id}"</code> exists.</p>
          <Link to="/products" className="btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
            ← Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to="/products" className="breadcrumb-link">Products</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="detail-grid">
        {/* ── Image ── */}
        <div className="detail-image-wrap">
          {product.badge && (
            <span className={`badge badge--${product.badge.toLowerCase()}`}>
              {product.badge}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="detail-image"
          />
          {/* Wishlist button */}
          <button
            className={`detail-wishlist ${isWishlisted ? "detail-wishlist--active" : ""}`}
            onClick={() => { toggleWishlist(product); }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>

        {/* ── Info ── */}
        <div className="detail-info">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          {/* Pricing */}
          <div className="detail-pricing">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="price-original">${product.originalPrice.toFixed(2)}</span>
                <span className="price-discount">−{discount ?? 0}%</span>
              </>
            )}
          </div>

          {/* Description (mock) */}
          <p className="detail-desc">
            Premium quality product in the {product.category} category. Rated{" "}
            {product.rating}/5 by {product.reviewCount.toLocaleString()} customers.
            Ships within 2–3 business days with free returns.
          </p>

          {/* Actions */}
          <div className="detail-actions">
            <button
              className={`btn-primary btn-cart-detail ${isInCart ? "btn-cart-detail--added" : ""}`}
              onClick={handleToggleCart}
              aria-pressed={isInCart}
            >
              {isInCart ? "✓  Remove from Cart" : "+ Add to Cart"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => { void navigate("/products"); }}
            >
              ← Back
            </button>
          </div>

          {/* Cart status notice */}
          {isInCart && (
            <p className="detail-cart-notice">
              In your cart —{" "}
              <button
                className="btn-link"
                onClick={openDrawer}
              >
                view cart
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
