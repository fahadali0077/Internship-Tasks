import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="font-serif text-[8rem] font-normal leading-none text-border">
        404
      </p>
      <h1 className="mt-4 font-serif text-3xl font-normal">Page not found</h1>
      <p className="mt-3 max-w-sm text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-ink-soft"
        >
          Go home
        </Link>
        <Link
          href="/products"
          className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-semibold text-ink-soft transition-all hover:border-amber hover:text-amber"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
