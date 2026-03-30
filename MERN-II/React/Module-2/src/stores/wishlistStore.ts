import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { WishlistItem, Product } from "@/types";

// ─── State + Actions interface ────────────────────────────────────────────────
interface WishlistStore {
  items: WishlistItem[];
  isWishlisted: (id: string) => boolean;
  toggle: (product: Product) => void;
  clear: () => void;
}
export const useWishlistStore = create<WishlistStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ── Initial state ──────────────────────────────────────────────────
        items: [],

        // ── Selector ──────────────────────────────────────────────────────
        isWishlisted: (id: string) =>
          get().items.some((item) => item.id === id),

        // ── Actions ───────────────────────────────────────────────────────
        toggle: (product: Product) => {
          set(
            (state) => {
              const exists = state.items.some((i) => i.id === product.id);
              if (exists) {
                return {
                  items: state.items.filter((i) => i.id !== product.id),
                };
              }
              const newItem: WishlistItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              };
              return { items: [...state.items, newItem] };
            },
            false,
            "wishlist/toggle",
          );
        },

        clear: () => {
          set({ items: [] }, false, "wishlist/clear");
        },
      }),
      {
        name: "wishlist-storage",
      },
    ),
    { name: "WishlistStore" },
  ),
);
