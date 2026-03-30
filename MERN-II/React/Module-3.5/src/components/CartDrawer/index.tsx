/**
 * CartDrawer — slide-in cart panel, reads Zustand cartStore directly.
 *
 * NEXT.JS MIGRATION NOTE (Module 4):
 *   This component uses hooks (useCartStore) and handles user events, so it
 *   must become a Client Component. When migrating, add 'use client' as the
 *   very first line of the file (before any imports).
 */
import { useCartStore } from "@/stores/cartStore";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice());

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        className={`drawer-backdrop ${isOpen ? "drawer-backdrop--visible" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        {/* ── Header ── */}
        <div className="drawer-header">
          <h2 className="drawer-title">
            Cart
            {items.length > 0 && (
              <span className="drawer-count">{items.length}</span>
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
              <button className="btn-checkout">
                Proceed to Checkout →
              </button>
              <button
                className="btn-clear"
                onClick={clearCart}
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
