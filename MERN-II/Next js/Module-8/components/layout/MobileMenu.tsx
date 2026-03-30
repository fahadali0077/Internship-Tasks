"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", exact: true },
  { href: "/products", label: "Products", exact: false },
  { href: "/cart", label: "Cart", exact: false },
  { href: "/auth/login", label: "Log In", exact: false },
  { href: "/auth/register", label: "Register", exact: false },
];

/**
 * MobileMenu — hamburger nav for screens < md.
 *
 * Uses Framer Motion AnimatePresence to animate the menu panel
 * in/out. This is the same pattern used by CartDrawer.
 *
 * RESPONSIVE STRATEGY:
 *   MobileMenu renders in the Navbar but is hidden on md+ screens:
 *   className="md:hidden"
 *   The desktop NavLinks have className="hidden md:flex"
 *   This is mobile-first Tailwind — small screens get the hamburger,
 *   larger screens get the inline nav links.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => { setOpen((v) => !v); }}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-ink-soft dark:border-dark-border dark:bg-dark-surface dark:text-white"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay + panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
              onClick={() => { setOpen(false); }}
              aria-hidden="true"
            />

            {/* Slide-down panel */}
            <motion.nav
              key="panel"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-4 right-4 top-20 z-50 rounded-2xl border border-border bg-white p-4 shadow-lg dark:border-dark-border dark:bg-dark-surface"
            >
              <ul className="flex flex-col gap-1">
                {links.map(({ href, label, exact }) => {
                  const isActive = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => { setOpen(false); }}
                        className={cn(
                          "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-amber-dim font-semibold text-amber dark:bg-amber/10"
                            : "text-ink-soft hover:bg-cream dark:text-white dark:hover:bg-dark-surface-2",
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
