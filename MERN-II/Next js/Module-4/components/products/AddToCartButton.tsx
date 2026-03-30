"use client";

import { useCartStore, type CartState } from "@/stores/cartStore";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s: CartState) => s.addItem);
  const removeItem = useCartStore((s: CartState) => s.removeItem);
  const openDrawer = useCartStore((s: CartState) => s.openDrawer);
  const isInCart = useCartStore((s: CartState) =>
    s.items.some((i: CartState["items"][number]) => i.product.id === product.id),
  );

  const handleClick = () => {
    if (isInCart) {
      removeItem(product.id);
    } else {
      addItem(product, 1);
      openDrawer();
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-pressed={isInCart}
      aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
      className={cn(
        "mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
        isInCart
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-ink text-white hover:bg-ink-soft hover:-translate-y-0.5",
      )}
    >
      {isInCart ? "✓  In Cart" : "+ Add to Cart"}
    </button>
  );
}
