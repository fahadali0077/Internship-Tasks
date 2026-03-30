import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getSessionCart, getSessionCartTotal } from "@/lib/session";
import { RemoveButton, QtyStepper, ClearCartButton } from "@/components/cart/CartActions";

export const dynamic = "force-dynamic"; // always render fresh (never cache this page)

export default async function CartPage() {
  // Both of these read the HttpOnly cookie on the server
  const cart = await getSessionCart();
  const totalPrice = await getSessionCartTotal();

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag size={56} className="text-border dark:text-dark-border" />
        <h1 className="mt-6 font-serif text-3xl font-normal text-ink-soft dark:text-white">
          Your cart is empty
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Add some products to get started.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink-soft dark:bg-amber dark:hover:bg-amber-600"
        >
          Browse Products →
        </Link>
      </div>
    );
  }

  // ── Cart with items ─────────────────────────────────────────────────────────
  return (
    <div className="pb-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-normal tracking-tight dark:text-white md:text-5xl">
          Your <span className="text-amber">Cart</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {cart.length} item{cart.length !== 1 ? "s" : ""} ·{" "}
          <span className="text-xs font-medium text-amber">
            Session stored in HttpOnly cookie
          </span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* ── Items list ─────────────────────────────────────────────────────── */}
        <div className="divide-y divide-border/60 rounded-xl border border-border bg-white dark:divide-dark-border dark:border-dark-border dark:bg-dark-surface">
          {cart.map(({ product, qty }) => (
            <div key={product.id} className="flex items-center gap-4 p-4 md:gap-5 md:p-5">
              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 flex-shrink-0 rounded-lg object-cover bg-cream md:h-20 md:w-20"
              />

              {/* Body */}
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

              {/*
                QtyStepper — Client Component.
                Calls updateCartQty() Server Action → updates cookie → revalidatePath
                → this Server Component re-renders with fresh qty.
              */}
              <QtyStepper productId={product.id} currentQty={qty} />

              {/* Line total — rendered server-side */}
              <span className="hidden w-20 text-right text-sm font-bold tabular-nums text-ink dark:text-white sm:block">
                ${(product.price * qty).toFixed(2)}
              </span>

              {/*
                RemoveButton — Client Component.
                Calls removeFromCart() Server Action → revalidatePath → re-render.
              */}
              <RemoveButton productId={product.id} productName={product.name} />
            </div>
          ))}
        </div>

        {/* ── Order summary — Server Component ─────────────────────────────── */}
        <aside className="sticky top-24 rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface md:p-7">
          <h2 className="mb-6 font-serif text-xl font-normal dark:text-white">
            Order Summary
          </h2>

          {/* Line items */}
          <div className="mb-5 space-y-3">
            {cart.map(({ product, qty }) => (
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

            <button className="w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-ink-soft dark:bg-amber dark:hover:bg-amber-600">
              Proceed to Checkout →
            </button>

            {/* ClearCartButton — Client Component */}
            <ClearCartButton />
          </div>

          {/* Module 6 info badge */}
          <div className="mt-5 rounded-lg border border-amber/30 bg-amber-dim px-3 py-2 dark:bg-amber/10">
            <p className="text-xs leading-relaxed text-amber">
              <strong>Module 6:</strong> Cart persists in a server-side HttpOnly cookie.
              Refresh the page — items remain. In MERN-III this moves to MongoDB.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
