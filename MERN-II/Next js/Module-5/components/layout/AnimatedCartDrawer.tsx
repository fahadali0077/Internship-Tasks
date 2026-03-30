"use client";


import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore, type CartState } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: "100%", opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", damping: 28, stiffness: 300 },
  },
};

export function AnimatedCartDrawer() {
  const isOpen = useCartStore((s: CartState) => s.isOpen);
  const items = useCartStore((s: CartState) => s.items);
  const closeDrawer = useCartStore((s: CartState) => s.closeDrawer);
  const removeItem = useCartStore((s: CartState) => s.removeItem);
  const updateQty = useCartStore((s: CartState) => s.updateQty);
  const clearCart = useCartStore((s: CartState) => s.clearCart);
  const totalPrice = useCartStore((s: CartState) => s.totalPrice());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Animated backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Animated drawer panel */}
          <motion.aside
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit={{ x: "100%", opacity: 0.8, transition: { duration: 0.22 } }}
            className="fixed right-0 top-0 z-50 flex h-full w-[420px] max-w-full flex-col bg-white shadow-2xl dark:bg-dark-surface"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5 dark:border-dark-border">
              <h2 className="flex items-center gap-3 font-serif text-2xl font-normal dark:text-white">
                Cart
                {items.length > 0 && (
                  <motion.span
                    key={items.length}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="rounded-full bg-amber px-2 py-0.5 font-sans text-xs font-bold text-white"
                  >
                    {items.length}
                  </motion.span>
                )}
              </h2>
              <button
                onClick={closeDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink-muted transition-colors hover:bg-border dark:bg-dark-surface-2 dark:text-white"
                aria-label="Close cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
                <ShoppingBag size={48} className="text-border dark:text-dark-border" />
                <p className="font-serif text-xl text-ink-soft dark:text-white">Your cart is empty</p>
                <p className="text-sm text-ink-muted">Add some products to get started.</p>
                <Button variant="outline" onClick={closeDrawer} asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <ul className="flex-1 divide-y divide-border/50 overflow-y-auto px-6 dark:divide-dark-border">
                  <AnimatePresence initial={false}>
                    {items.map(({ product, qty }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.18 } }}
                        className="flex items-start gap-4 py-5"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 flex-shrink-0 rounded-lg object-cover bg-cream"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink dark:text-white">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm font-bold text-ink dark:text-white">
                            ${(product.price * qty).toFixed(2)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-cream text-ink hover:bg-border dark:border-dark-border dark:bg-dark-surface-2 dark:text-white"
                              onClick={() => { updateQty(product.id, qty - 1); }}
                              aria-label="Decrease"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold dark:text-white">
                              {qty}
                            </span>
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-cream text-ink hover:bg-border dark:border-dark-border dark:bg-dark-surface-2 dark:text-white"
                              onClick={() => { updateQty(product.id, qty + 1); }}
                              aria-label="Increase"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                          onClick={() => { removeItem(product.id); }}
                          aria-label={`Remove ${product.name}`}
                        >
                          <X size={14} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Footer */}
                <div className="border-t border-border p-6 dark:border-dark-border">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Total</span>
                    <motion.span
                      key={totalPrice}
                      initial={{ scale: 1.1, color: "#d97706" }}
                      animate={{ scale: 1, color: "currentColor" }}
                      className="text-2xl font-bold tabular-nums dark:text-white"
                    >
                      ${totalPrice.toFixed(2)}
                    </motion.span>
                  </div>
                  <Button className="mb-3 w-full" size="lg">
                    Proceed to Checkout →
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-ink-muted hover:border-red-300 hover:text-red-600 dark:border-dark-border dark:text-white"
                    onClick={clearCart}
                  >
                    Clear cart
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
