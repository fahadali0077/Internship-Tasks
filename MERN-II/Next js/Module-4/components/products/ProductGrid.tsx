import { fetchProducts } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export async function ProductGrid() {
  // This await runs on the server — the client never sees this fetch
  const products = await fetchProducts();

  if (products.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="font-serif text-2xl text-ink-soft">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
