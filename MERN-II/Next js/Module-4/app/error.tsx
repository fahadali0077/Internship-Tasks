"use client";

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
