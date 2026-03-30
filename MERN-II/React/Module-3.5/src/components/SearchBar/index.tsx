import { useRef, useEffect, type ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  resultCount: number;
  isLoading: boolean;
}

export function SearchBar({ value, onChange, resultCount, isLoading }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount — useRef DOM side-effect, not useState
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar">
      {/* .search-input-wrap is position:relative — required for icon/clear to position inside it */}
      <div className="search-input-wrap">
        <span className="search-icon" aria-hidden="true">
          {isLoading ? (
            <span className="search-spinner" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </span>

        <input
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder="Search products…"
          value={value}
          onChange={handleChange}
          aria-label="Search products"
          autoComplete="off"
          spellCheck={false}
        />

        {value.length > 0 && (
          <button
            className="search-clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {/* Live result count — only shown when user has typed something */}
      {value.length > 0 && !isLoading && (
        <p className="search-count" role="status" aria-live="polite">
          {resultCount === 0
            ? "No products match your search"
            : `${resultCount} product${resultCount !== 1 ? "s" : ""} found`}
        </p>
      )}
    </div>
  );
}
