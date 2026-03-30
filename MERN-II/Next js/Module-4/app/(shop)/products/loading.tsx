import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div>
      <div className="mb-10">
        <div className="h-12 w-64 animate-pulse rounded-lg bg-cream" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-cream" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
