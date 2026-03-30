import { useState, useEffect } from "react";

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
