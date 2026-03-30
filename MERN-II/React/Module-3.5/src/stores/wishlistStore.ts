import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { Product } from "@/types";

// ─── State shape ──────────────────────────────────────────────────────────────
interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clear: () => void;
}


export const useWishlistStore = create<WishlistState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        toggle: (product) => {
          set(
            (state) => {
              const exists = state.items.some((i) => i.id === product.id);
              return {
                items: exists
                  ? state.items.filter((i) => i.id !== product.id)
                  : [...state.items, product],
              };
            },
            false,
            "wishlist/toggle",
          );
        },

        isWishlisted: (productId) => get().items.some((i) => i.id === productId),

        clear: () => set({ items: [] }, false, "wishlist/clear"),
      }),
      {
        name: "mern-ii-wishlist", // localStorage key
        // Only persist `items` — functions are not serialisable
        partialize: (state) => ({ items: state.items }),
      },
    ),
    { name: "WishlistStore" },
  ),
);
