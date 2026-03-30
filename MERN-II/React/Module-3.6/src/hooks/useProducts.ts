import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { Product, CartItem, ApiResponse } from "@/types";

// ─── Query keys ───────────────────────────────────────────────────────────────
// Centralising query keys as constants prevents typo bugs and makes
// invalidation predictable. In Module 8 these move to a queryKeys factory.
export const QUERY_KEYS = {
  products: ["products"] as const,
  cart: ["cart"] as const,
} as const;

// ─── Fetcher functions ────────────────────────────────────────────────────────
// Pure async functions — no React, no hooks. Easily unit-testable.

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products.json");
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json() as Promise<Product[]>;
}

// Simulates POST /cart — in Module 6 this becomes a real Server Action
async function postCartItem(item: CartItem): Promise<ApiResponse<CartItem>> {
  // Simulate 300ms network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Simulate occasional failure (10% chance) so you can test error handling
  if (Math.random() < 0.1) {
    throw new Error("Mock server error — retry the mutation");
  }

  return {
    success: true,
    message: `${item.product.name} added to server cart`,
    data: item,
  };
}

// ─── useProducts ──────────────────────────────────────────────────────────────
/**
 * useProducts — TanStack Query useQuery hook.
 *
 * MENTAL MODEL — server state vs client state:
 *
 *   Client state (Zustand): data that ONLY the browser knows about.
 *   Examples: cart items, wishlist, drawer open/close, theme.
 *   Source of truth: your JavaScript runtime.
 *
 *   Server state (TanStack Query): data that LIVES on a server and is
 *   only CACHED in the browser.
 *   Examples: product list, user profile, order history.
 *   Source of truth: the server. The browser's copy can go stale.
 *
 * useQuery handles the full async lifecycle automatically:
 *   - loading on first fetch
 *   - caching (no re-fetch during staleTime window)
 *   - background refetch when data goes stale
 *   - retry on failure
 *   - deduplication (two components calling useQuery with the same key
 *     share ONE request, not two)
 *
 * Compare to Module 2's useFetch:
 *   useFetch: you wrote loading/error/data states + AbortController + cleanup
 *   useQuery: all of that is handled + caching + background refetch + devtools
 */
export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: fetchProducts,
    staleTime: 60_000, // products don't change often — stay fresh for 1 min
  });
}

// ─── useAddToCartMutation ─────────────────────────────────────────────────────
/**
 * useAddToCartMutation — TanStack Query useMutation with optimistic update.
 *
 * MENTAL MODEL — optimistic updates:
 *   Normally: click "add to cart" → wait for server → update UI.
 *   Optimistic: click "add to cart" → update UI immediately → send request
 *               → if it fails, roll back to the previous UI state.
 *
 *   This makes the UI feel instant even over slow connections. The pattern
 *   is:
 *     onMutate    → save previous cache, apply optimistic update
 *     onError     → roll back to saved previous state
 *     onSettled   → invalidate the query so it refetches fresh data
 *
 * Here we're using it with our Zustand cartStore (the mutation talks to a
 * mock endpoint; the real cart UI reads from Zustand). In Module 6, when
 * cart is cookie-session based, the mutation will write to the server and
 * the query will read back from it.
 */
export function useAddToCartMutation() {
  return useMutation({
    mutationFn: postCartItem,

    // Called immediately BEFORE the mutation fires — optimistic update
    onMutate: async (newItem: CartItem) => {
      // Cancel any outgoing refetches to prevent them overwriting our update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.cart });

      // Snapshot previous value for rollback
      const previousCart = queryClient.getQueryData<CartItem[]>(QUERY_KEYS.cart);

      // Optimistically update the cache
      queryClient.setQueryData<CartItem[]>(QUERY_KEYS.cart, (old = []) => {
        const existing = old.find((i) => i.product.id === newItem.product.id);
        if (existing) {
          return old.map((i) =>
            i.product.id === newItem.product.id
              ? { ...i, qty: i.qty + newItem.qty }
              : i,
          );
        }
        return [...old, newItem];
      });

      // Return context for potential rollback
      return { previousCart };
    },

    // If mutation fails, roll back to the snapshot
    onError: (_err, _newItem, context) => {
      if (context?.previousCart !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.cart, context.previousCart);
      }
    },

    // Always refetch after mutation (success or failure) to stay in sync
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
  });
}
