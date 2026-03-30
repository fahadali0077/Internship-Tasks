import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products — electronics, fashion, books, sports and more.",
  openGraph: {
    title: "All Products | MERNShop",
    description: "Browse all products — electronics, fashion, books, sports and more.",
  },
};
export default function ProductsPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-normal tracking-tight dark:text-white md:text-5xl">
          All <span className="text-amber">Products</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Streaming row-by-row · next/image blur placeholders · next/font Playfair Display
        </p>
      </div>

      {/* Outer Suspense — catches initial async ProductGrid resolution */}
      <Suspense fallback={<ProductGridSkeleton />}>
        {/* Inner Suspense per row lives inside ProductGrid → ProductRow */}
        <ProductGrid />
      </Suspense>
    </div>
  );
}
