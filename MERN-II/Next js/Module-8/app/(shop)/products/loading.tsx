/**
 * loading.tsx — /products route loading state
 *
 * MENTAL MODEL:
 *   loading.tsx is a special Next.js file. It wraps the page in a
 *   Suspense boundary automatically. When Next.js navigates to /products
 *   (or on hard refresh), this component renders INSTANTLY while the
 *   async page.tsx resolves.
 *
 *   The user sees skeleton cards immediately — no blank screen, no spinner.
 *   This is React Suspense + Next.js streaming working together.
 *
 *   The header below renders in loading.tsx rather than showing the real
 *   page header, so there's no layout jump when data loads.
 */

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
