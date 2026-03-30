"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Settings, LogOut, Menu, X, Command,
} from "lucide-react";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/orders", label: "Live Orders", icon: ShoppingCart, exact: false },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The login page must render WITHOUT the sidebar shell.
  // If the layout wraps /admin/login, the sidebar appears behind the form.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    // Clear the mock admin_session cookie by setting it expired
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/");
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      className={cn(
        "flex flex-col gap-1",
        mobile ? "p-4" : "flex-1 px-3 py-4",
      )}
      aria-label="Admin navigation"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => { setSidebarOpen(false); }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-amber text-white shadow-sm"
                : "text-ink-muted hover:bg-cream hover:text-ink dark:hover:bg-dark-surface-2 dark:hover:text-white",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={17} className="flex-shrink-0" />
            {label}
          </Link>
        );
      })}

      <div className="mt-auto pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-parchment dark:bg-dark-bg">
      {/* CommandPalette — global, listens for Cmd+K */}
      <CommandPalette />

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-border bg-white dark:border-dark-border dark:bg-dark-surface lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4 dark:border-dark-border">
          <span className="text-xl text-amber">◈</span>
          <div>
            <p className="font-serif text-base leading-tight dark:text-white">
              <span className="text-amber">MERN</span>Shop
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Admin
            </p>
          </div>
        </div>
        <Sidebar />
      </aside>

      {/* ── Mobile sidebar overlay ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => { setSidebarOpen(false); }}
            aria-hidden="true"
          />
          <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-white dark:border-dark-border dark:bg-dark-surface lg:hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-dark-border">
              <p className="font-serif text-base dark:text-white">
                <span className="text-amber">MERN</span>Shop Admin
              </p>
              <button onClick={() => { setSidebarOpen(false); }} aria-label="Close menu">
                <X size={18} className="text-ink-muted" />
              </button>
            </div>
            <Sidebar mobile />
          </aside>
        </>
      )}

      {/* ── Main area ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex flex-shrink-0 items-center justify-between border-b border-border bg-white px-5 py-3 dark:border-dark-border dark:bg-dark-surface">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSidebarOpen(true); }}
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} className="text-ink-muted dark:text-white" />
            </button>
            <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
              <span className="dark:text-white">Admin</span>
              {pathname !== "/admin" && (
                <>
                  <span className="mx-1.5">›</span>
                  <span className="capitalize dark:text-white">
                    {pathname.replace("/admin/", "")}
                  </span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Cmd+K trigger button */}
            <button
              onClick={() => {
                // Dispatch synthetic keyboard event to trigger CommandPalette
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
                );
              }}
              className="hidden items-center gap-2 rounded-lg border border-border bg-parchment px-3 py-1.5 text-xs text-ink-muted transition hover:border-amber hover:text-amber dark:border-dark-border dark:bg-dark-surface-2 dark:text-white sm:flex"
              aria-label="Open command palette"
            >
              <Command size={12} />
              <span>⌘K</span>
            </button>

            <ThemeToggle />

            {/* Admin avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-xs font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
