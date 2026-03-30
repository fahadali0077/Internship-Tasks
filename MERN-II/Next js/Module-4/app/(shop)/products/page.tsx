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
      {/* Page header — renders instantly (no async) */}
      <div className="mb-10">
        <h1 className="font-serif text-5xl font-normal tracking-tight">
          All <span className="text-amber">Products</span>
        </h1>
        <p className="mt-2 text-ink-muted">
          Fetched as a Server Component · ISR revalidation every 60s
        </p>
      </div>

      {/*
        Suspense boundary:
          - fallback renders immediately (skeleton cards)
          - when ProductGrid's async fetch resolves, React swaps in the real grid
          - this is "streaming" — partial HTML is sent progressively
      */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
