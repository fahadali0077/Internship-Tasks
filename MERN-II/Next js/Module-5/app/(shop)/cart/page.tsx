"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCartStore, type CartState } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((s: CartState) => s.items);
  const removeItem = useCartStore((s: CartState) => s.removeItem);
  const updateQty = useCartStore((s: CartState) => s.updateQty);
  const clearCart = useCartStore((s: CartState) => s.clearCart);
  const totalPrice = useCartStore((s: CartState) => s.totalPrice());

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag size={56} className="text-border dark:text-dark-border" />
        <h1 className="mt-6 font-serif text-3xl font-normal text-ink-soft dark:text-white">
          Your cart is empty
        </h1>
        <p className="mt-3 text-ink-muted">Add some products to get started.</p>
        <Button asChild className="mt-8">
          <Link href="/products">Browse Products →</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-normal tracking-tight dark:text-white md:text-5xl">
          Your <span className="text-amber">Cart</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Items */}
        <div className="divide-y divide-border/60 rounded-xl border border-border bg-white dark:divide-dark-border dark:border-dark-border dark:bg-dark-surface">
          {items.map(({ product, qty }) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-4 p-4 md:gap-5 md:p-5"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 flex-shrink-0 rounded-lg object-cover bg-cream md:h-20 md:w-20"
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${product.id}`}
                  className="block truncate font-medium text-ink transition-colors hover:text-amber dark:text-white"
                >
                  {product.name}
                </Link>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">
                  {product.category}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink-muted">
                  ${product.price.toFixed(2)} each
                </p>
              </div>

              <div className="flex items-center gap-1.5 md:gap-2">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded border border-border bg-cream text-ink hover:bg-border dark:border-dark-border dark:bg-dark-surface-2 dark:text-white"
                  onClick={() => { updateQty(product.id, qty - 1); }}
                >
                  <Minus size={11} />
                </button>
                <span className="w-7 text-center text-sm font-semibold tabular-nums dark:text-white">
                  {qty}
                </span>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded border border-border bg-cream text-ink hover:bg-border dark:border-dark-border dark:bg-dark-surface-2 dark:text-white"
                  onClick={() => { updateQty(product.id, qty + 1); }}
                >
                  <Plus size={11} />
                </button>
              </div>

              <span className="hidden w-20 text-right text-sm font-bold tabular-nums text-ink dark:text-white sm:block">
                ${(product.price * qty).toFixed(2)}
              </span>

              <button
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                onClick={() => { removeItem(product.id); }}
                aria-label={`Remove ${product.name}`}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <aside className="sticky top-24 rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface md:p-7">
          <h2 className="mb-6 font-serif text-xl font-normal dark:text-white">Order Summary</h2>
          <div className="mb-5 space-y-3">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate text-ink-soft dark:text-ink-muted">
                  {product.name} × {qty}
                </span>
                <span className="flex-shrink-0 font-medium tabular-nums dark:text-white">
                  ${(product.price * qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-5 dark:border-dark-border">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-medium dark:text-white">Total</span>
              <span className="text-2xl font-bold tabular-nums dark:text-white">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Button className="w-full" size="lg">Proceed to Checkout →</Button>
            <Button
              variant="outline"
              className="mt-3 w-full text-xs text-ink-muted hover:border-red-300 hover:text-red-600 dark:border-dark-border dark:text-white"
              onClick={clearCart}
            >
              Clear cart
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
