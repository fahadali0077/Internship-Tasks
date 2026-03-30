"use client";

/**
 * error.tsx — App Router error boundary
 *
 * MENTAL MODEL:
 *   error.tsx is automatically wrapped in a React Error Boundary by Next.js.
 *   If any Server Component in the subtree throws (e.g. fetchProducts fails),
 *   this component renders instead of a blank screen.
 *
 *   'use client' is REQUIRED — error boundaries must be Client Components
 *   because they use React's error boundary lifecycle (componentDidCatch).
 *
 *   Props:
 *     error  — the thrown Error object
 *     reset  — a function to re-render the segment (retry)
 *
 * App Router equivalent map:
 *   React Router: no built-in equivalent (you'd use react-error-boundary)
 *   Next.js:      app/error.tsx — built-in, per-segment error boundaries
 */

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <span className="text-5xl">⚠</span>
      <h1 className="mt-6 font-serif text-3xl font-normal text-red-600">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-ink-muted">
        {error.message || "An unexpected error occurred."}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-border">
          Digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-ink-soft"
      >
        Try again
      </button>
    </div>
  );
}
