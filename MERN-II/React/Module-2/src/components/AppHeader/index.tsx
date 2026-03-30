import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

interface AppHeaderProps {
  onCartOpen: () => void;
}

export function AppHeader({ onCartOpen }: AppHeaderProps) {
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-mark">◈</span>
          <span className="logo-text">
            <span className="logo-mern">MERN</span>
            <span className="logo-shop">Shop</span>
          </span>
        </div>

        <nav className="header-nav">
          <span className="nav-tag">Module 2 — Live Search</span>
        </nav>

        <div className="header-actions">
          {/* Wishlist count badge */}
          {wishlistCount > 0 && (
            <div className="wishlist-count-wrap">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor"
                strokeWidth="2" fill="none" aria-label="Wishlist">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="cart-badge">{wishlistCount}</span>
            </div>
          )}

          {/* Cart button — opens CartDrawer */}
          <button
            className="cart-btn"
            onClick={onCartOpen}
            aria-label={`Open cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
          >
            <span className="cart-icon" aria-hidden="true">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge" aria-live="polite">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
