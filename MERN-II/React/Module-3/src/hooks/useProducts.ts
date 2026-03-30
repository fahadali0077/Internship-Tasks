import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { Product, CartItem, ApiResponse } from "@/types";

// ─── Query keys ───────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  products: ["products"] as const,
  cart: ["cart"] as const,
} as const;

// ─── Fetcher functions ───────────────────────────────────────────────────────
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
    success: true as const,
    message: `${item.product.name} added to server cart`,
    data: item,
  };
}


export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: fetchProducts,
    staleTime: 60_000,
  });
}


export function useAddToCartMutation() {
  return useMutation({
    mutationFn: postCartItem,


    onMutate: async (newItem: CartItem) => {

      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.cart });

      const previousCart = queryClient.getQueryData<CartItem[]>(QUERY_KEYS.cart);

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


      return { previousCart };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousCart !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.cart, context.previousCart);
      }
    },


    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
  });
}
