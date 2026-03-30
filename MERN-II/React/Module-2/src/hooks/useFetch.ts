import { useState, useEffect } from "react";

export interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export function useFetch<T>(url: string | null): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!url) {
      setData(null);
      setIsLoading(false);
      setIsError(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(null);

    async function doFetch() {
      try {
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = (await res.json()) as T;
        setData(json);
        setIsLoading(false);
      } catch (err) {

        if (err instanceof Error && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Unknown error";
        setIsError(true);
        setError(message);
        setIsLoading(false);
      }
    }

    doFetch().catch(() => {
    });


    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, isLoading, isError, error };
}
