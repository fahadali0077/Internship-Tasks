import type { SortOption } from "@/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "reviews-desc", label: "Most Reviewed" },
  { value: "name-asc", label: "Name: A → Z" },
];

interface SortControlProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  disabled?: boolean;
}

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
