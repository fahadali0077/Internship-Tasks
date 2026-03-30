"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", exact: true },
  { href: "/products", label: "Products", exact: false },
  { href: "/cart", label: "Cart", exact: false },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1" aria-label="Main navigation">
      {links.map(({ href, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              isActive
                ? "font-semibold text-amber"
                : "text-ink-soft hover:bg-cream hover:text-ink dark:text-white dark:hover:bg-dark-surface-2",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
