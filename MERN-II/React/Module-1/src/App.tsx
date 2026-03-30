import { useState, useMemo, useCallback } from "react";

import { AppHeader } from "@/components/AppHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductList } from "@/components/ProductList";
import { useCart } from "@/hooks/useCart";
import { PRODUCTS, ALL_CATEGORIES, type CategoryFilter as TCategoryFilter } from "@/data/products";
import type { Product } from "@/types";


export default function App() {
  // ── Filter state (lifted from CategoryFilter) ──────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<TCategoryFilter>("All");

  // ── Cart drawer open/close state (stub — CartDrawer wired in Module 3) ─────
  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleCartClick = useCallback(() => { setIsCartOpen((prev) => !prev); }, []);

  // ── Cart state (encapsulated in a custom hook) ─────────────────────────────
  const { cartIds, toggle: onToggleCart, count: cartCount } = useCart();

  const filteredProducts = useMemo<Product[]>(() => {
    if (selectedCategory === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Pre-compute counts for the filter pills (runs once per category change)
  const categoryCounts = useMemo(() => {
    const counts = {} as Record<TCategoryFilter, number>;
    for (const cat of ALL_CATEGORIES) {
      counts[cat] =
        cat === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat).length;
    }
    return counts;
  }, []);

  return (
    <div className="app">
      <AppHeader cartCount={cartCount} onCartClick={handleCartClick} />

      <main className="main-content">
        {/* ── Page title ── */}
        <div className="page-hero">
          <h1 className="page-title">
            Discover <span className="title-accent">Products</span>
          </h1>
          <p className="page-sub">
            {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""} · {" "}
            {selectedCategory}
          </p>
        </div>

        {/* ── Category filter (controlled input — state lifted to App) ── */}
        <CategoryFilter
          value={selectedCategory}
          onChange={setSelectedCategory}
          counts={categoryCounts}
        />

        {/* ── Product grid ── */}
        <ProductList
          products={filteredProducts}
          cartIds={cartIds}
          onToggleCart={onToggleCart}
        />
      </main>

      {isCartOpen && (
        <div
          className="cart-drawer-placeholder"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
        >
          <button
            className="cart-drawer-close"
            onClick={() => { setIsCartOpen(false); }}
            aria-label="Close cart"
          >
            ✕
          </button>
          <p className="cart-drawer-hint">
            CartDrawer wired in Module 3 — Zustand + TanStack Query
          </p>
        </div>
      )}

      <footer className="app-footer">
        <p>Module 1 — Product Card UI</p>
      </footer>
    </div>
  );
}
