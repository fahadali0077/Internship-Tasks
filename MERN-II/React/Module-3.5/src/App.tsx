import { useState, useMemo } from "react";

import { AppHeader } from "@/components/AppHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { SortControl } from "@/components/SortControl";
import { ProductList } from "@/components/ProductList";
import { CartDrawer } from "@/components/CartDrawer";
import { RegisterForm } from "@/components/RegisterForm";

import { useDebounce } from "@/hooks/useDebounce";
import { useProducts, useAddToCartMutation } from "@/hooks/useProducts";

import { useCartStore } from "@/stores/cartStore";

import { ALL_CATEGORIES, type CategoryFilter as TCategoryFilter } from "@/data/products";
import type { Product, SortOption } from "@/types";

const SORT_FNS: Record<SortOption, (a: Product, b: Product) => number> = {
  featured: (a, b) => a.id.localeCompare(b.id),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
  "reviews-desc": (a, b) => b.reviewCount - a.reviewCount,
};

type View = "shop" | "register";


export default function App() {
  // ── View toggle (shop vs register form) ────────────────────────────────────
  const [view, setView] = useState<View>("shop");

  // ── Server state via TanStack Query ────────────────────────────────────────
  const { data, isLoading, error } = useProducts();

  // ── Zustand cart store — selected slices only ───────────────────────────────
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const cartCount = useCartStore((s) => s.totalItems());

  // ── Mutation for server-side cart sync ─────────────────────────────────────
  const addToCartMutation = useAddToCartMutation();

  // ── Filter / sort state ────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TCategoryFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const debouncedQuery = useDebounce(query, 400);

  // ── Toggle cart: Zustand update + server mutation ──────────────────────────
  const handleToggleCart = (product: Product) => {
    const isInCart = cartItems.some((i) => i.product.id === product.id);

    if (isInCart) {
      removeItem(product.id);
    } else {
      // 1. Update Zustand immediately (optimistic — instant UI feedback)
      addItem(product, 1);
      // 2. Fire the server mutation in background
      addToCartMutation.mutate({ product, qty: 1 });
      // 3. Open the cart drawer to confirm the addition
      openDrawer();
    }
  };

  // ── Derived: filtered + sorted products ────────────────────────────────────
  const filteredProducts = useMemo<Product[]>(() => {
    if (!data) return [];
    const needle = debouncedQuery.trim().toLowerCase();
    return data
      .filter((p) => {
        const matchCat = selectedCategory === "All" || p.category === selectedCategory;
        const matchQ = !needle || p.name.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle);
        return matchCat && matchQ;
      })
      .sort(SORT_FNS[sortOption]);
  }, [data, debouncedQuery, selectedCategory, sortOption]);

  const categoryCounts = useMemo(() => {
    const source = data ?? [];
    return Object.fromEntries(
      ALL_CATEGORIES.map((cat) => [
        cat,
        cat === "All" ? source.length : source.filter((p) => p.category === cat).length,
      ]),
    ) as Record<TCategoryFilter, number>;
  }, [data]);

  const cartItemIds = useMemo(
    () => new Set(cartItems.map((i) => i.product.id)),
    [cartItems],
  );

  const subtitle = isLoading ? "Loading products…"
    : error ? "Could not load products"
      : debouncedQuery ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""} for "${debouncedQuery}"`
        : `${filteredProducts.length} item${filteredProducts.length !== 1 ? "s" : ""} · ${selectedCategory}`;

  return (
    <div className="app">
      {/* CartDrawer lives at root — reads Zustand store directly */}
      <CartDrawer />

      <AppHeader
        cartCount={cartCount}
        onCartClick={openDrawer}
        onRegisterClick={() => { setView(view === "register" ? "shop" : "register"); }}
        showingRegister={view === "register"}
      />

      <main className="main-content">
        {view === "register" ? (
          /* ── Module 3.5: Registration Form ── */
          <div className="register-page">
            <RegisterForm
              onSuccess={() => { setTimeout(() => setView("shop"), 1500); }}
              onSwitchToLogin={() => { setView("shop"); }}
            />
          </div>
        ) : (
          /* ── Shop view ── */
          <>
            <div className="page-hero">
              <h1 className="page-title">
                Discover <span className="title-accent">Products</span>
              </h1>
              <p className="page-sub">{subtitle}</p>
            </div>

            <div className="toolbar">
              <SearchBar
                value={query}
                onChange={setQuery}
                resultCount={filteredProducts.length}
                isLoading={isLoading}
              />
              <SortControl
                value={sortOption}
                onChange={setSortOption}
                disabled={isLoading || !!error}
              />
            </div>

            <CategoryFilter
              value={selectedCategory}
              onChange={setSelectedCategory}
              counts={categoryCounts}
            />

            <ProductList
              products={filteredProducts}
              cartIds={cartItemIds}
              onToggleCart={handleToggleCart}
              loading={isLoading}
              error={error?.message ?? null}
            />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Module 3.5 — Registration Form with Validation</p>
      </footer>
    </div>
  );
}
