"use client";

import { useCartStore, type CartState } from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
  const count = useCartStore((s: CartState) => s.totalItems());
  const openDrawer = useCartStore((s: CartState) => s.openDrawer);

  return (
    <button
      onClick={openDrawer}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-sm"
      aria-label={`Open cart — ${count} items`}
    >
      <ShoppingCart size={18} className="text-ink-soft" />
      {count > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-parchment bg-amber px-1 text-[11px] font-bold text-white"
          aria-live="polite"
        >
          {count}
        </span>
      )}
    </button>
  );
}
