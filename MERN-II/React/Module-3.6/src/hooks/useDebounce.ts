import { useState, useEffect } from "react";

/**
 * useDebounce<T>
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns a "settled" copy of `value` that only updates after `delay` ms of
 * silence since the last change.
 *
 * WHY THIS EXISTS
 * Without debouncing, every keystroke would trigger a fetch or a heavy filter
 * pass on every render. At 60 wpm that is ~10 calls/second. Debounce collapses
 * those into a single call once the user pauses typing.
 *
 * THE CLEANUP PATTERN  ← most important concept in this hook
 *
 *   useEffect(() => {
 *     const id = setTimeout(() => setDebounced(value), delay);
 *     return () => clearTimeout(id);   // ← cleanup
 *   }, [value, delay]);
 *
 * React calls the cleanup function in TWO situations:
 *   1. Before re-running the effect → cancels any pending timer
 *   2. On component unmount         → prevents setState on a dead component
 *
 * React 19 Strict Mode double-invokes effects in development intentionally to
 * expose missing cleanups. This hook handles it correctly.
 *
 * GENERIC OVER T — works for strings, numbers, objects, anything.
 *
 * @param value - The reactive value to debounce
 * @param delay - Milliseconds to wait (default 400ms per curriculum spec)
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Schedule the state update after `delay` ms
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // CLEANUP: cancel the scheduled update if value changes before delay elapses.
    // This is what makes debouncing work — every new keystroke cancels the
    // previous timer before starting a fresh one.
    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, delay]); // Only re-run when value or delay changes

  return debouncedValue;
}
