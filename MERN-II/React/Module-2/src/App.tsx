import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { AppHeader } from "@/components/AppHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductList } from "@/components/ProductList";
import { SearchBar } from "@/components/SearchBar";
import { SortControl } from "@/components/SortControl";

import type { SortOption } from "@/types";

import { useDebounce } from "@/hooks/useDebounce";


import { fetchProducts } from "@/lib/api";

import { ALL_CATEGORIES } from "@/data/products";
import type { CategoryFilter as TCategoryFilter } from "@/data/products";
import type { Product } from "@/types";


export default function App() {
  // ── UI state ──────────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [selectedCategory, setSelectedCategory] = useState<TCategoryFilter>("All");

  const [sortOrder, setSortOrder] = useState<SortOption>("featured");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleCartOpen = useCallback(() => { setIsCartOpen(true); }, []);
  const handleCartClose = useCallback(() => { setIsCartOpen(false); }, []);

  // ── Server state via TanStack Query ───────────────────────────────────────

  const { data: allProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // ── Filter + sort function (memoised) ─────────────────────────────────────
  const filterFn = useMemo<(products: Product[]) => Product[]>(() => {
    return (products: Product[]) => {
      let result = [...products];

      // 1. Category filter
      if (selectedCategory !== "All") {
        result = result.filter((p) => p.category === selectedCategory);
      }

      // 2. Search filter (name + category, case-insensitive)
      const q = debouncedQuery.trim().toLowerCase();
      if (q !== "") {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q),
        );
      }

      // 3. Sort — every SortOption member must have a case here.
      switch (sortOrder) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating-desc":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "reviews-desc":
          result.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "featured":
        default:
          // No sort — preserve original server order
          break;
      }

      return result;
    };
  }, [selectedCategory, debouncedQuery, sortOrder]);

  // ── Category pill counts ───────────────────────────────────────────────────
  const categoryCounts = useMemo(() => {
    const source = allProducts ?? [];
    const counts = {} as Record<TCategoryFilter, number>;
    for (const cat of ALL_CATEGORIES) {
      counts[cat] =
        cat === "All"
          ? source.length
          : source.filter((p) => p.category === cat).length;
    }
    return counts;
  }, [allProducts]);

  // ── Filtered count for subtitle ───────────────────────────────────────────
  const filteredCount = useMemo(
    () => filterFn(allProducts ?? []).length,
    [filterFn, allProducts],
  );

  return (
    <div className="app">
      <AppHeader onCartOpen={handleCartOpen} />

      <main className="main-content">
        <div className="page-hero">
          <h1 className="page-title">
            Discover <span className="title-accent">Products</span>
          </h1>
          <p className="page-sub">
            {filteredCount} item{filteredCount !== 1 ? "s" : ""} · {selectedCategory}
          </p>
        </div>

        <SearchBar
          value={query}
          onChange={setQuery}
          resultCount={filteredCount}
          isLoading={false}
        />

        <div className="toolbar">
          <CategoryFilter
            value={selectedCategory}
            onChange={setSelectedCategory}
            counts={categoryCounts}
          />
          <SortControl value={sortOrder} onChange={setSortOrder} />
        </div>

        {/* ProductList owns its own loading/error/empty states via useQuery */}
        <ProductList filterFn={filterFn} />
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
            onClick={handleCartClose}
            aria-label="Close cart"
          >
            ✕
          </button>
          <p className="cart-drawer-hint">
            CartDrawer — wired in Module 3 with Zustand + TanStack Query
          </p>
        </div>
      )}

      <footer className="app-footer">
        <p>Module 2 — Live Search with Custom Hooks</p>
      </footer>
    </div>
  );
}
