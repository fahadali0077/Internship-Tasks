import { useState, useEffect, useCallback } from "react";

/**
 * useLocalStorage<T> — persist state to localStorage with a type-safe API.
 *
 * MENTAL MODEL:
 *   Think of this as useState, but the value survives a page refresh.
 *   It syncs React state ↔ localStorage on every write, and reads the
 *   persisted value on first mount.
 *
 * WHY NOT JUST USE localStorage DIRECTLY?
 *   • Direct writes don't trigger re-renders — other components stay stale.
 *   • No JSON serialisation/deserialisation boilerplate.
 *   • No handling of SSR/window-undefined errors.
 *   • No cross-tab sync (the storage event listener below handles this).
 *
 * ZUSTAND NOTE:
 *   Zustand's persist middleware (used in wishlistStore) is built on the
 *   same idea but scoped to a Zustand store. Use useLocalStorage when you
 *   need to persist arbitrary component-local state without a global store.
 *
 * USAGE:
 *   const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
 *   const [prefs, setPrefs]  = useLocalStorage<UserPrefs>("user-prefs", defaults);
 *
 * @param key      - localStorage key (must be unique per usage)
 * @param initial  - value to use when no persisted value exists yet
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // ── Lazy initialiser ───────────────────────────────────────────────────────
  // Reads localStorage once on mount. The function form of useState prevents
  // JSON.parse from running on every render.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial; // SSR guard
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initial;
    } catch {
      // Corrupt data, missing permissions, or private browsing restrictions
      return initial;
    }
  });

  // ── Setter ─────────────────────────────────────────────────────────────────
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage quota exceeded or private browsing — fail silently
          console.warn(`useLocalStorage: could not write key "${key}"`, next);
        }
        return next;
      });
    },
    [key],
  );

  // ── Remove ─────────────────────────────────────────────────────────────────
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setStoredValue(initial);
  }, [key, initial]);

  // ── Cross-tab sync ─────────────────────────────────────────────────────────
  // If the same key is updated in another browser tab, sync this component.
  // The "storage" event only fires in OTHER tabs — not the one that wrote.
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;
      try {
        setStoredValue(e.newValue !== null ? (JSON.parse(e.newValue) as T) : initial);
      } catch {
        setStoredValue(initial);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [key, initial]);

  return [storedValue, setValue, removeValue];
}
