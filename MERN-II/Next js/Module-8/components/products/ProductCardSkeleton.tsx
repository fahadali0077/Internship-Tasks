import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] border border-border/60 bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface">
      <Skeleton className="aspect-square w-full rounded-none bg-cream dark:bg-dark-surface-2" />
      <div className="flex flex-col gap-3 p-4 md:p-5">
        <Skeleton className="h-3 w-20 rounded-full bg-cream dark:bg-dark-surface-2" />
        <Skeleton className="h-5 w-4/5 bg-cream dark:bg-dark-surface-2" />
        <Skeleton className="h-4 w-3/5 bg-cream dark:bg-dark-surface-2" />
        <Skeleton className="h-4 w-24 bg-cream dark:bg-dark-surface-2" />
        <Skeleton className="mt-2 h-10 w-full rounded-lg bg-cream dark:bg-dark-surface-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
