"use client";


import { useTransition } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { addToCart, removeFromCart } from "@/app/actions/cart";
import { useCartStore, type CartState } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  isInCartSession?: boolean; // from Server Component (cookie)
  size?: "default" | "lg";
}

export function AddToCartButton({
  product,
  isInCartSession = false,
  size = "lg",
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Also update Zustand for the drawer UI (instant feedback)
  const addItemToStore = useCartStore((s: CartState) => s.addItem);
  const removeItemFromStore = useCartStore((s: CartState) => s.removeItem);
  const openDrawer = useCartStore((s: CartState) => s.openDrawer);
  const isInStore = useCartStore((s: CartState) =>
    s.items.some((i: CartState["items"][number]) => i.product.id === product.id),
  );

  const isInCart = isInCartSession || isInStore;

  const handleClick = () => {
    startTransition(async () => {
      if (isInCart) {
        // Remove from both Zustand and cookie session
        removeItemFromStore(product.id);
        await removeFromCart(product.id);
      } else {
        // Add to both Zustand (instant drawer feedback) and cookie session
        addItemToStore(product, 1);
        openDrawer();
        await addToCart(product.id, 1);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isInCart}
      aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-lg font-semibold transition-all disabled:opacity-60",
        size === "lg" ? "px-5 py-3 text-base" : "px-4 py-2.5 text-sm",
        isInCart
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-ink text-white hover:bg-ink-soft dark:bg-amber dark:hover:bg-amber-600",
      )}
    >
      {isPending ? (
        <Loader2 size={15} className="animate-spin" />
      ) : isInCart ? (
        <><Check size={15} /> In Cart</>
      ) : (
        <><ShoppingCart size={15} /> Add to Cart</>
      )}
    </button>
  );
}
