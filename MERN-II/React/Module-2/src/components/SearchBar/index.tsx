import { useRef, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  isLoading: boolean;
  placeholder?: string;
}


export function SearchBar({
  value,
  onChange,
  resultCount,
  isLoading,
  placeholder = "Search products…",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount. Empty deps [] = runs once, never again.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleClear() {
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div className="search-bar" role="search">
      <span className="search-icon" aria-hidden="true">
        {isLoading ? (
          <span className="search-spinner" />
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </span>

      <input
        ref={inputRef}
        type="search"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        autoComplete="off"
        spellCheck={false}
      />

      <span className="search-meta" aria-live="polite">
        {!isLoading && value.trim() !== "" && (
          <span className="result-count">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </span>
        )}
      </span>

      {value !== "" && (
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
  );
}
