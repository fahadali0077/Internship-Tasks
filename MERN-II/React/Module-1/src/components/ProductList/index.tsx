import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface ProductListProps {
  products: Product[];
  cartIds: ReadonlySet<string>;
  onToggleCart: (id: string) => void;
}


export function ProductList({ products, cartIds, onToggleCart }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state" role="status">
        <span className="empty-icon" aria-hidden="true">◈</span>
        <p className="empty-title">No products found</p>
        <p className="empty-sub">Try a different category filter.</p>
      </div>
    );
  }

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
