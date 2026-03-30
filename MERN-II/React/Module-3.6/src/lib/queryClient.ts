import { QueryClient } from "@tanstack/react-query";

/**
 * queryClient — the single QueryClient instance for the whole app.
 *
 * MENTAL MODEL: QueryClient is the in-memory cache registry.
 * Every useQuery/useMutation call in the tree talks to THIS instance.
 * We create it once here and pass it to <QueryClientProvider> in main.tsx.
 *
 * Key config options explained:
 *
 * staleTime: 60_000 (1 minute)
 *   Data is considered "fresh" for 1 minute after it was fetched.
 *   During this window, React Query will NOT refetch — even if you
 *   navigate away and come back. After 1 minute it becomes "stale"
 *   and will be refetched in the background on the next component mount.
 *
 * gcTime: 5 * 60_000 (5 minutes)  [formerly cacheTime in v4]
 *   How long UNUSED (unmounted) query data stays in the cache before
 *   being garbage collected. If no component is subscribed to a query,
 *   it hangs around for 5 minutes before being evicted.
 *
 * retry: 1
 *   On failure, retry once before surfacing the error. For a production
 *   app you might use retry: (count, error) => count < 3 && !is404(error)
 *
 * refetchOnWindowFocus: true (default)
 *   When the user tabs away and returns, stale queries are refetched
 *   silently in the background. This keeps data fresh without polling.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          // 1 minute — data freshness window
      gcTime: 5 * 60_000,         // 5 minutes — cache retention after unmount
      retry: 1,                   // retry once on failure
      refetchOnWindowFocus: true, // silent refresh when tab regains focus
    },
    mutations: {
      retry: 0, // mutations should not auto-retry (not idempotent)
    },
  },
});
