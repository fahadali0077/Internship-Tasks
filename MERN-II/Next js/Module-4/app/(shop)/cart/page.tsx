"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
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
        <p className="font-serif text-5xl text-border">🛒</p>
        <h1 className="mt-6 font-serif text-3xl font-normal text-ink-soft">
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
        <h1 className="font-serif text-5xl font-normal tracking-tight">
          Your <span className="text-amber">Cart</span>
        </h1>
        <p className="mt-2 text-ink-muted">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* ── Items ── */}
        <div className="divide-y divide-border/60 rounded-xl border border-border bg-white">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex items-center gap-5 p-5">
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 flex-shrink-0 rounded-lg object-cover bg-cream"
              />

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${product.id}`}
                  className="block truncate font-medium text-ink transition-colors hover:text-amber"
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

              {/* Qty stepper */}
              <div className="flex items-center gap-2">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded border border-border bg-cream text-ink transition-colors hover:bg-border"
                  onClick={() => { updateQty(product.id, qty - 1); }}
                  aria-label="Decrease"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">
                  {qty}
                </span>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded border border-border bg-cream text-ink transition-colors hover:bg-border"
                  onClick={() => { updateQty(product.id, qty + 1); }}
                  aria-label="Increase"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Line total */}
              <span className="w-20 text-right text-sm font-bold tabular-nums text-ink">
                ${(product.price * qty).toFixed(2)}
              </span>

              {/* Remove */}
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                onClick={() => { removeItem(product.id); }}
                aria-label={`Remove ${product.name}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Summary ── */}
        <aside className="sticky top-24 rounded-xl border border-border bg-white p-7">
          <h2 className="mb-6 font-serif text-xl font-normal">Order Summary</h2>

          <div className="mb-5 space-y-3">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate text-ink-soft">
                  {product.name} × {qty}
                </span>
                <span className="flex-shrink-0 font-medium tabular-nums">
                  ${(product.price * qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="text-2xl font-bold tabular-nums">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <Button className="w-full" size="lg">
              Proceed to Checkout →
            </Button>
            <Button
              variant="outline"
              className="mt-3 w-full text-xs text-ink-muted hover:border-red-300 hover:text-red-600"
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
