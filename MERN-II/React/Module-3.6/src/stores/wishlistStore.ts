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

/**
 * wishlistStore — Zustand store with persist middleware.
 *
 * MENTAL MODEL — persist middleware:
 *   Zustand's persist middleware wraps the store and automatically:
 *     1. Reads the initial state from localStorage on mount (hydration)
 *     2. Writes state to localStorage after every action (serialisation)
 *
 *   The `name` key is the localStorage key.
 *   You can optionally provide `partialize` to only persist specific fields:
 *     partialize: (state) => ({ items: state.items })
 *   This is useful if you have non-serialisable values (functions) in state.
 *
 *   In Module 5 this will be replaced by Zustand's persist with a custom
 *   storage adapter that syncs to the server. For now, localStorage is fine.
 *
 * Note on middleware composition:
 *   We stack devtools(persist(...)) — devtools is the outer wrapper so Redux
 *   DevTools can observe even the persist rehydration action.
 */
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
