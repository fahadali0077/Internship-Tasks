import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] border border-border/60 bg-white shadow-sm">
      <Skeleton className="aspect-square w-full rounded-none bg-cream" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * ProductGridSkeleton — renders 8 ProductCardSkeletons in a grid.
 * Used as the Suspense fallback for the /products page.
 */
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
