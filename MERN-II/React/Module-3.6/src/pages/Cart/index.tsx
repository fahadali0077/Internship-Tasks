import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";

/**
 * CartPage — "/cart"
 * Protected by ProtectedRoute — only authenticated users reach this.
 *
 * Reads directly from Zustand cartStore. No props needed —
 * the store is globally accessible.
 *
 * Subtitle uses totalItems() (sum of all quantities) not items.length
 * (distinct product count) — they diverge as soon as any item qty > 1.
 */
export function CartPage() {
  const items      = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty  = useCartStore((s) => s.updateQty);
  const clearCart  = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-hero">
          <h1 className="page-title">Your <span className="title-accent">Cart</span></h1>
        </div>
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">🛒</span>
          <p className="empty-title">Your cart is empty</p>
          <p className="empty-sub">Browse our products and add something you like.</p>
          <Link to="/products" className="btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-hero">
        <h1 className="page-title">Your <span className="title-accent">Cart</span></h1>
        <p className="page-sub">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
      </div>

      <div className="cart-layout">
        {/* ── Items ── */}
        <div className="cart-items">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="cart-row">
              <img
                src={product.image}
                alt={product.name}
                className="cart-row-img"
                loading="lazy"
              />

              <div className="cart-row-body">
                <Link
                  to={`/products/${product.id}`}
                  className="cart-row-name"
                >
                  {product.name}
                </Link>
                <p className="cart-row-category">{product.category}</p>
                <p className="cart-row-unit">${product.price.toFixed(2)} each</p>
              </div>

              {/* Qty stepper */}
              <div className="qty-stepper">
                <button
                  className="qty-btn"
                  onClick={() => { updateQty(product.id, qty - 1); }}
                  aria-label="Decrease quantity"
                >−</button>
                <span className="qty-value">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => { updateQty(product.id, qty + 1); }}
                  aria-label="Increase quantity"
                >+</button>
              </div>

              {/* Line total */}
              <p className="cart-row-total">${(product.price * qty).toFixed(2)}</p>

              {/* Remove */}
              <button
                className="cart-row-remove"
                onClick={() => { removeItem(product.id); }}
                aria-label={`Remove ${product.name}`}
              >✕</button>
            </div>
          ))}
        </div>

        {/* ── Summary ── */}
        <aside className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-rows">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="summary-row">
                <span className="summary-row-name">
                  {product.name} × {qty}
                </span>
                <span className="summary-row-price">
                  ${(product.price * qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <span className="summary-total-price">${totalPrice.toFixed(2)}</span>
          </div>

          <button
              className="btn-primary summary-cta"
              disabled
              aria-label="Proceed to checkout — available in Module 6"
              title="Checkout wired in Module 6 with Next.js Server Actions"
            >
            Proceed to Checkout →
          </button>

          <button
            className="btn-ghost summary-clear"
            onClick={clearCart}
          >
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}
