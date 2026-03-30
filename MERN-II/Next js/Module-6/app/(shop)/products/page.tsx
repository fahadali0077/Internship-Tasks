import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products in our store.",
};

export default function ProductsPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-normal tracking-tight dark:text-white md:text-5xl">
          All <span className="text-amber">Products</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Server Component · ISR revalidation every 60s
        </p>
      </div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
