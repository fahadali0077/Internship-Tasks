"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore, type CartState } from "@/stores/cartStore";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  size?: "default" | "lg";
}

export function AddToCartButton({ product, size = "lg" }: AddToCartButtonProps) {
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
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      aria-pressed={isInCart}
      aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
        size === "lg" ? "px-5 py-3 text-base" : "px-4 py-2.5 text-sm",
        isInCart
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-ink text-white hover:bg-ink-soft dark:bg-amber dark:hover:bg-amber-600",
      )}
    >
      {isInCart ? (
        <>
          <Check size={16} />
          In Cart
        </>
      ) : (
        <>
          <ShoppingCart size={16} />
          Add to Cart
        </>
      )}
    </motion.button>
  );
}
