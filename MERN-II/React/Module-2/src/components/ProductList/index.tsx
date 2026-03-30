import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

interface ProductListProps {
  filterFn: (products: Product[]) => Product[];
}

export function ProductList({ filterFn }: ProductListProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="product-grid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-card" aria-hidden="true">
            <div className="skeleton-image" />
            <div className="skeleton-body">
              <div className="skeleton-line skeleton-line--short" />
              <div className="skeleton-line skeleton-line--long" />
              <div className="skeleton-line skeleton-line--med" />
              <div className="skeleton-btn" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="fetch-error" role="alert">
        <span className="error-icon" aria-hidden="true">⚠</span>
        <div>
          <strong>Failed to load products</strong>
          <p>{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const products = filterFn(data ?? []);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="empty-state" role="status">
        <span className="empty-icon" aria-hidden="true">◈</span>
        <p className="empty-title">No products found</p>
        <p className="empty-sub">Try a different search or category.</p>
      </div>
    );
  }

  return (
    <section className="product-grid" aria-label="Product listing">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
