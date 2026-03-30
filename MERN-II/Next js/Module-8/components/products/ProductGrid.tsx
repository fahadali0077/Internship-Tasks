import { fetchProducts } from "@/lib/products";
import { ProductRow } from "./ProductRow";

const ROW_SIZE = 4;

export async function ProductGrid() {
  const products = await fetchProducts();

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-ink-soft dark:text-white">No products found</p>
      </div>
    );
  }

  // Chunk products into rows of ROW_SIZE
  const rows: (typeof products)[] = [];
  for (let i = 0; i < products.length; i += ROW_SIZE) {
    rows.push(products.slice(i, i + ROW_SIZE));
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {rows.map((rowProducts, rowIndex) => (
        <ProductRow
          key={rowIndex}
          products={rowProducts}
          rowIndex={rowIndex}
        />
      ))}
    </div>
  );
}
