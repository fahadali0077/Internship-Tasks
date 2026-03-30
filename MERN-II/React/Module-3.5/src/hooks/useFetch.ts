import { useState, useEffect, useRef } from "react";

/**
 * useFetch<T> — generic data-fetching hook (Module 2 custom hook).
 *
 * MENTAL MODEL:
 *   This hook encapsulates the three concerns of any async fetch:
 *     1. Loading state   — is the request in flight?
 *     2. Error state     — did the server/network fail?
 *     3. Data state      — what did we get back?
 *
 *   It also handles the cleanup concern:
 *     When the component unmounts mid-request, the AbortController cancels
 *     the fetch so we never call setState on an unmounted component.
 *     (React 18 Strict Mode double-invokes effects — the cleanup makes this safe.)
 *
 * MODULE 3 NOTE:
 *   In Module 3 this raw hook is SUPERSEDED by TanStack Query's useQuery for
 *   server-fetched data. useQuery adds: automatic caching, background refetch,
 *   staleTime, deduplication, devtools, and retry.
 *   useFetch remains here as:
 *     a) A teaching artefact showing what useQuery handles for you.
 *     b) A fallback for one-off fetches that don't need the full query cache.
 *     c) The Module 2 implementation carried forward per curriculum requirements.
 *
 * USAGE:
 *   const { data, loading, error } = useFetch<Product[]>("/api/products.json");
 */

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Keep a stable reference to url without making it a useEffect dependency
  // that re-runs on every render if url is an inline string literal.
  // (Using a ref avoids the double-fetch risk in Strict Mode for the same URL.)
  const urlRef = useRef<string>(url);
  useEffect(() => {
    urlRef.current = url;
  });

  useEffect(() => {
    // Abort controller — cancels the in-flight request when:
    //   • The component unmounts
    //   • The url prop changes before the previous fetch resolves
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status.toString()}: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: unknown) => {
        // AbortError is expected on cleanup — don't treat it as a real error
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });

    // ── Cleanup ──────────────────────────────────────────────────────────────
    // Runs when url changes (cancels stale request) or component unmounts.
    return () => {
      controller.abort();
    };
  }, [url]); // Re-fetch whenever url changes

  return { data, loading, error };
}
