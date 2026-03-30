import { useEffect, useCallback } from "react";
import { useCartStore } from "@/stores/cartStore";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  // ── Escape key handler ────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    },
    [closeDrawer],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Backdrop — click to close, hidden from AT */}
      <div
        className={`drawer-backdrop ${isOpen ? "drawer-backdrop--visible" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel — role="dialog" required for screen-reader modal announcement */}
      <aside
        className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        {/* ── Header ── */}
        <div className="drawer-header">
          <h2 className="drawer-title">
            Cart
            {/* Badge uses totalItems() to match the header badge exactly */}
            {totalItems > 0 && (
              <span className="drawer-count" aria-label={`${totalItems} items`}>
                {totalItems}
              </span>
            )}
          </h2>
          <button
            className="drawer-close"
            onClick={closeDrawer}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* ── Empty state ── */}
        {items.length === 0 && (
          <div className="drawer-empty">
            <span className="drawer-empty-icon" aria-hidden="true">🛒</span>
            <p className="drawer-empty-title">Your cart is empty</p>
            <p className="drawer-empty-sub">Add some products to get started.</p>
          </div>
        )}

        {/* ── Items list ── */}
        {items.length > 0 && (
          <>
            <ul className="drawer-items">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="drawer-item">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="drawer-item-img"
                    loading="lazy"
                  />

                  <div className="drawer-item-body">
                    <p className="drawer-item-name">{product.name}</p>
                    <p className="drawer-item-price">
                      ${(product.price * qty).toFixed(2)}
                    </p>

                    {/* Qty stepper */}
                    <div className="qty-stepper">
                      <button
                        className="qty-btn"
                        onClick={() => { updateQty(product.id, qty - 1); }}
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        −
                      </button>
                      <span className="qty-value" aria-live="polite">{qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => { updateQty(product.id, qty + 1); }}
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="drawer-remove"
                    onClick={() => { removeItem(product.id); }}
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {/* ── Footer ── */}
            <div className="drawer-footer">
              <div className="drawer-total">
                <span>Total</span>
                <span className="drawer-total-price">${totalPrice.toFixed(2)}</span>
              </div>

              {/*
                Checkout — disabled stub until Module 6 wires the Server Action.
                aria-label provides context that it's a checkout action.
                disabled prevents accidental clicks before the route exists.
              */}
              <button
                className="btn-checkout"
                disabled
                aria-label="Proceed to checkout — available in Module 6"
                title="Checkout wired in Module 6 with Next.js Server Actions"
              >
                Proceed to Checkout →
              </button>

              <button
                className="btn-clear"
                onClick={clearCart}
                aria-label="Remove all items from cart"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
