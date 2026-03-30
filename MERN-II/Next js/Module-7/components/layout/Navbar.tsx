import Link from "next/link";
import { CartButton } from "./CartButton";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-parchment/90 backdrop-blur-md dark:border-dark-border dark:bg-dark-bg/90">
      <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-3 md:gap-6 md:px-6 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="MERNShop home">
          <span className="text-2xl text-amber">◈</span>
          <span className="font-serif text-xl">
            <span className="text-amber">MERN</span>
            <span className="text-ink dark:text-white">Shop</span>
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>

        <div className="flex-1" />

        {/* Desktop auth links — hidden on mobile */}
        <nav className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-semibold text-ink-soft transition-all hover:border-amber hover:text-amber dark:border-dark-border dark:bg-dark-surface dark:text-white dark:hover:border-amber dark:hover:text-amber"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-ink-soft dark:bg-amber dark:hover:bg-amber-600"
          >
            Register
          </Link>
        </nav>

        {/* Theme toggle + Cart — always visible */}
        <ThemeToggle />
        <CartButton />

        {/* Mobile hamburger — hidden on desktop */}
        <MobileMenu />
      </div>
    </header>
  );
}
