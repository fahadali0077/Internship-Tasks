import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface ProductListProps {
  products: Product[];
  cartIds: ReadonlySet<string>;
  onToggleCart: (product: Product) => void;   // Module 3: full Product, not just id
  loading?: boolean;
  error?: string | null;
}

export function ProductList({
  products = [],            // ← default prevents the undefined.length crash
  cartIds,
  onToggleCart,
  loading = false,
  error = null,
}: ProductListProps) {

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="product-grid" aria-label="Loading products" aria-busy="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-card" aria-hidden="true">
            <div className="skeleton skeleton--image" />
            <div className="skeleton-body">
              <div className="skeleton skeleton--tag" />
              <div className="skeleton skeleton--title" />
              <div className="skeleton skeleton--title-short" />
              <div className="skeleton skeleton--stars" />
              <div className="skeleton skeleton--price" />
              <div className="skeleton skeleton--btn" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="error-state" role="alert">
        <span className="error-icon" aria-hidden="true">⚠</span>
        <p className="error-title">Failed to load products</p>
        <p className="error-sub">{error}</p>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="empty-state" role="status">
        <span className="empty-icon" aria-hidden="true">◈</span>
        <p className="empty-title">No products found</p>
        <p className="empty-sub">Try a different search term or category.</p>
      </div>
    );
  }

  // ── Product grid ───────────────────────────────────────────────────────────
  return (
    <section className="product-grid" aria-label="Product listing">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          inCart={cartIds.has(product.id)}
          onToggleCart={onToggleCart}
        />
      ))}
    </section>
  );
}
