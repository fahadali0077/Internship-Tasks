import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

// ─── State shape ──────────────────────────────────────────────────────────────
interface CartState {
  // Data
  items: CartItem[];
  isOpen: boolean; // drawer visibility

  // Actions
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Selectors (computed values — keep in store so any component can subscribe)
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: [],
      isOpen: false,

      // ── addItem ─────────────────────────────────────────────────────────────
      // If product already in cart → increment qty. Otherwise append new item.
      addItem: (product, qty = 1) => {
        set(
          (state) => {
            const existing = state.items.find((i) => i.product.id === product.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
                ),
              };
            }
            return { items: [...state.items, { product, qty }] };
          },
          false,
          "cart/addItem",
        );
      },

      // ── removeItem ──────────────────────────────────────────────────────────
      removeItem: (productId) => {
        set(
          (state) => ({ items: state.items.filter((i) => i.product.id !== productId) }),
          false,
          "cart/removeItem",
        );
      },

      // ── updateQty ───────────────────────────────────────────────────────────
      // qty <= 0 → remove the item entirely (defensive)
      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set(
          (state) => ({
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, qty } : i,
            ),
          }),
          false,
          "cart/updateQty",
        );
      },

      // ── clearCart ───────────────────────────────────────────────────────────
      clearCart: () => set({ items: [] }, false, "cart/clearCart"),

      // ── Drawer ──────────────────────────────────────────────────────────────
      openDrawer: () => set({ isOpen: true }, false, "cart/openDrawer"),
      closeDrawer: () => set({ isOpen: false }, false, "cart/closeDrawer"),
      toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen }), false, "cart/toggleDrawer"),

      // ── Selectors ──────────────────────────────────────────────────────────
      // Arrow functions that read from current state.
      // Components subscribe with: useCartStore(s => s.totalPrice())
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    }),
    { name: "CartStore" }, // label in Redux DevTools
  ),
);
