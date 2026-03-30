import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { CartDrawer } from "@/components/CartDrawer";



export function RootLayout() {
  const cartCount = useCartStore((s) => s.totalItems());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    void navigate("/login");
  };

  return (
    <div className="app">
      {/* CartDrawer sits here so it overlays everything */}
      <CartDrawer />

      {/* ── Navbar ── */}
      <header className="app-header">
        <div className="header-inner">
          {/* Logo */}
          <NavLink to="/" className="logo" aria-label="MERNShop home">
            <span className="logo-mark">◈</span>
            <span className="logo-text">
              <span className="logo-mern">MERN</span>
              <span className="logo-shop">Shop</span>
            </span>
          </NavLink>

          {/* Nav links */}
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink
              to="/"
              end                      // "end" = only active on exact "/"
              className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
            >
              Products
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="nav-user">Hi, {user?.name}</span>
                <button className="btn-nav-ghost" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `btn-nav-ghost ${isActive ? "btn-nav-ghost--active" : ""}`
                  }
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `btn-nav-ghost ${isActive ? "btn-nav-ghost--active" : ""}`
                  }
                >
                  Register
                </NavLink>
              </>
            )}

            {/* Cart button */}
            <button
              className="cart-btn"
              onClick={openDrawer}
              aria-label={`Open cart — ${cartCount} items`}
            >
              <span aria-hidden="true">🛒</span>
              {cartCount > 0 && (
                <span className="cart-badge" aria-live="polite">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Page content — child route renders here ── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <p> Module 3.6 — Multi-Page SPA with React Router </p>
      </footer>
    </div>
  );
}
