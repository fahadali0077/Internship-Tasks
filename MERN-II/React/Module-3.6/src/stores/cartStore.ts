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

/**
 * cartStore — Zustand client-state store.
 *
 * MENTAL MODEL — why Zustand over prop drilling (Module 1/2) or Context?
 *
 * Prop drilling (Module 1): works at small scale but becomes painful when
 * CartDrawer (deep in the tree) needs the same data as AppHeader (at the top).
 * You'd have to thread cartIds + handlers through every component in between.
 *
 * Context API: solves the threading problem but has a re-render problem —
 * every consumer re-renders when ANY value in the context changes, even if
 * they only care about one field.
 *
 * Zustand: each component subscribes to EXACTLY the slice it needs via a
 * selector. A component using only `totalPrice` does NOT re-render when
 * `isOpen` changes. This is Zustand's key advantage.
 *
 * SELECTORS: `totalItems` and `totalPrice` are functions stored in the state
 * object — called as `useCartStore(s => s.totalItems())` in components.
 * This is the Zustand pattern for derived/computed values.
 *
 * devtools middleware: wires up Redux DevTools browser extension.
 * Every action name appears in the DevTools action log with the new state.
 */
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
