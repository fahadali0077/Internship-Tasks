import { fetchProducts } from "@/lib/products";
import { ProductCard } from "./ProductCard";

/**
 * ProductGrid — async Server Component.
 *
 * Renders all products in a CSS grid. First 4 cards get priority={true}
 * so next/image preloads them — they're above the fold and affect LCP.
 *
 * MODULE 7 UPGRADE:
 *   Split into rows wrapped in individual Suspense boundaries (ProductRow)
 *   for progressive streaming. The priority prop remains correct — row 0 = true.
 */
export async function ProductGrid() {
  const products = await fetchProducts();

  if (products.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="font-serif text-2xl text-ink-soft dark:text-white">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4} // preload the first row (above the fold)
        />
      ))}
    </div>
  );
}
