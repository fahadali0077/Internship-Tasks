interface AppHeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export function AppHeader({ cartCount, onCartClick }: AppHeaderProps) {
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
          <span className="nav-tag">Module 3 — Cart & Wishlist State</span>
        </nav>

        <button
          className="cart-btn"
          onClick={onCartClick}
          aria-label={`Open cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
        >
          <span className="cart-icon" aria-hidden="true">🛒</span>
          {cartCount > 0 && (
            <span className="cart-badge" aria-live="polite">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
