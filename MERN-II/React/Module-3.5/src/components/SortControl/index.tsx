import type { SortOption } from "@/types";

// Use the SortOption type from @/types — NOT a local type
// (This was the root cause: local SortOrder had different values than App's SortOption)
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured",      label: "Featured" },
  { value: "price-asc",     label: "Price: Low → High" },
  { value: "price-desc",    label: "Price: High → Low" },
  { value: "rating-desc",   label: "Top Rated" },
  { value: "reviews-desc",  label: "Most Reviewed" },
];

interface SortControlProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  disabled?: boolean;            // ← was missing, caused TS error when App passed it
}

/**
 * SortControl — controlled <select> for sort order.
 * Uses SortOption from @/types so it stays in sync with App's state.
 */
export function SortControl({ value, onChange, disabled = false }: SortControlProps) {
  return (
    <div className="sort-control">
      <label htmlFor="sort-select" className="sort-label">
        Sort
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={value}
        onChange={(e) => { onChange(e.target.value as SortOption); }}
        disabled={disabled}
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
