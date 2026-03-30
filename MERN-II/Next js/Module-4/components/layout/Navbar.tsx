import Link from "next/link";
import { CartButton } from "./CartButton";
import { NavLinks } from "./NavLinks";

/**
 * Navbar — Server Component.
 *
 * NavLinks (Client) and CartButton (Client) are narrow client islands.
 * The Navbar shell itself is a Server Component — no JS shipped for it.
 *
 * COMPOSITION PATTERN:
 *   Server Component (Navbar)
 *     └── Client island (NavLinks) — needs usePathname()
 *     └── Client island (CartButton) — needs Zustand cartStore
 */

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-parchment/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-xl items-center gap-6 px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center gap-2.5" aria-label="MERNShop home">
          <span className="text-2xl text-amber">◈</span>
          <span className="font-serif text-xl">
            <span className="text-amber">MERN</span>
            <span className="text-ink">Shop</span>
          </span>
        </Link>

        {/* Main nav links */}
        <NavLinks />

        <div className="flex-1" />


        {/* Cart button — always visible */}
        <CartButton />
      </div>
    </header>
  );
}
