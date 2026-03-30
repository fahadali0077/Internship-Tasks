import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CartItem, Product } from "@/types";


interface CartStore {
  // ── State ────────────────────────────────────────────────────────────────
  items: CartItem[];


  totalItems: () => number;
  totalPrice: () => number;
  isInCart: (id: string) => boolean;

  // ── Actions ──────────────────────────────────────────────────────────────
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────────────────────
      items: [],

      // ── Selectors ────────────────────────────────────────────────────────
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      isInCart: (id: string) =>
        get().items.some((item) => item.id === id),

      // ── Actions ──────────────────────────────────────────────────────────

      addItem: (product: Product) => {
        set(
          (state) => {
            const existing = state.items.find((i) => i.id === product.id);

            if (existing) {
              // Product already in cart — increment quantity
              return {
                items: state.items.map((i) =>
                  i.id === product.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i,
                ),
              };
            }

            // New item — append a CartItem snapshot to the array
            const newItem: CartItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            };
            return { items: [...state.items, newItem] };
          },
          false,
          "cart/addItem",
        );
      },

      removeItem: (id: string) => {
        set(
          (state) => ({
            items: state.items.filter((i) => i.id !== id),
          }),
          false,
          "cart/removeItem",
        );
      },

      updateQty: (id: string, qty: number) => {
        // If qty drops to 0, remove the item entirely
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set(
          (state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: qty } : i,
            ),
          }),
          false,
          "cart/updateQty",
        );
      },

      clearCart: () => {
        set({ items: [] }, false, "cart/clearCart");
      },
    }),
    { name: "CartStore" }, // name shown in Redux DevTools
  ),
);
