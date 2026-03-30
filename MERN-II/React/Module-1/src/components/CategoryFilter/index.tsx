import { ALL_CATEGORIES, type CategoryFilter as TCategoryFilter } from "@/data/products";

interface CategoryFilterProps {
  value: TCategoryFilter;
  onChange: (value: TCategoryFilter) => void;
  counts: Record<TCategoryFilter, number>;
}


export function CategoryFilter({ value, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="filter-bar">
      <label htmlFor="category-select" className="filter-label">
        Filter by Category
      </label>

      {/* Pill buttons — more accessible than a bare select for few options */}
      <div className="filter-pills" role="radiogroup" aria-label="Product categories">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="radio"
            aria-checked={value === cat}
            className={`filter-pill ${value === cat ? "filter-pill--active" : ""}`}
            onClick={() => { onChange(cat); }}
          >
            {cat}
            <span className="pill-count">{counts[cat]}</span>
          </button>
        ))}
      </div>

      {/* Native select as a fallback / accessible alternative */}
      <select
        id="category-select"
        className="filter-select"
        value={value}
        onChange={(e) => { onChange(e.target.value as TCategoryFilter); }}
        aria-label="Select product category"
      >
        {ALL_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat} ({counts[cat]})
          </option>
        ))}
      </select>
    </div>
  );
}
