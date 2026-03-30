import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="font-serif text-[7rem] font-normal leading-none text-border dark:text-dark-border md:text-[9rem]">
        404
      </p>
      <h1 className="mt-4 font-serif text-2xl font-normal dark:text-white md:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft dark:bg-amber dark:hover:bg-amber-600">
          Go home
        </Link>
        <Link href="/products" className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-semibold text-ink-soft hover:border-amber hover:text-amber dark:border-dark-border dark:bg-dark-surface dark:text-white">
          Browse products
        </Link>
      </div>
    </div>
  );
}
