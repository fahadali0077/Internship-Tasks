import { useState, useMemo, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/stores/cartStore";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductList } from "@/components/ProductList";
import { SearchBar } from "@/components/SearchBar";
import { SortControl } from "@/components/SortControl";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ALL_CATEGORIES, type CategoryFilter as TCategoryFilter } from "@/data/products";
import type { Product, SortOption } from "@/types";

// Record<SortOption, ...> ensures TypeScript errors if any SortOption member
// is missing — a safe exhaustiveness check at compile time.
const SORT_FNS: Record<SortOption, (a: Product, b: Product) => number> = {
  featured:      (a, b) => a.id.localeCompare(b.id),
  "price-asc":   (a, b) => a.price - b.price,
  "price-desc":  (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
  "reviews-desc":(a, b) => b.reviewCount - a.reviewCount,
  "name-asc":    (a, b) => a.name.localeCompare(b.name),
};

/**
 * ProductsPage — "/products"
 * All filtering, sorting, and search logic lives here (lifted state).
 * ProductList, SearchBar, SortControl, CategoryFilter are pure presentational.
 */
export function ProductsPage() {
  const { data, isLoading, error } = useProducts();

  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TCategoryFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const debouncedQuery = useDebounce(query, 400);

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

  const handleToggleCart = useCallback((product: Product) => {
    const isInCart = cartItems.some((i) => i.product.id === product.id);
    if (isInCart) {
      removeItem(product.id);
    } else {
      addItem(product, 1);
      openDrawer();
    }
  }, [cartItems, addItem, removeItem, openDrawer]);

  const subtitle = isLoading ? "Loading…"
    : debouncedQuery
      ? `${filteredProducts.length} results for "${debouncedQuery}"`
      : `${filteredProducts.length} products in ${selectedCategory}`;

  return (
    <div className="products-page">
      <div className="page-hero">
        <h1 className="page-title">
          All <span className="title-accent">Products</span>
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
    </div>
  );
}
