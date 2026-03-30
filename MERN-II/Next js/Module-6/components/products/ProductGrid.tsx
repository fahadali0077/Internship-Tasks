import { fetchProducts } from "@/lib/products";
import { ProductCard } from "./ProductCard";

/**
 * ProductGrid — async Server Component.
 * First 4 cards get priority={true} so their images are preloaded (LCP).
 */
export async function ProductGrid() {
  const products = await fetchProducts();

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-ink-soft dark:text-white">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
