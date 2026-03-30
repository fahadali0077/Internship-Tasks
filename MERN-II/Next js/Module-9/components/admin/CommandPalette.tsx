"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";


const COMMANDS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin", group: "Navigate" },
  { id: "products", label: "Products Table", icon: Package, href: "/admin/products", group: "Navigate" },
  { id: "orders", label: "Live Orders", icon: ShoppingCart, href: "/admin/orders", group: "Navigate" },
  { id: "users", label: "Users", icon: Users, href: "/admin", group: "Navigate" },
  { id: "shop", label: "View Shop", icon: Package, href: "/products", group: "Navigate" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin", group: "Actions" },
  { id: "logout", label: "Log out", icon: LogOut, href: "/", group: "Actions" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); };
  }, [handleKeyDown]);

  const runCommand = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={() => { setOpen(false); }}
        aria-hidden="true"
      />

      {/* Command menu */}
      <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl dark:border-dark-border dark:bg-dark-surface">
        <Command className="flex flex-col" shouldFilter={true}>
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 dark:border-dark-border">
            <Search size={16} className="flex-shrink-0 text-ink-muted" />
            <Command.Input
              autoFocus
              placeholder="Search commands…"
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted dark:text-white"
            />
            <kbd className="hidden rounded border border-border bg-cream px-1.5 py-0.5 text-[10px] font-mono text-ink-muted sm:block dark:border-dark-border dark:bg-dark-surface-2 dark:text-white">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-ink-muted">
              No commands found.
            </Command.Empty>

            {["Navigate", "Actions"].map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-muted"
              >
                {COMMANDS.filter((c) => c.group === group).map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <Command.Item
                      key={cmd.id}
                      value={cmd.label}
                      onSelect={() => { runCommand(cmd.href); }}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition-colors aria-selected:bg-amber-dim aria-selected:text-amber dark:text-white dark:aria-selected:bg-amber/10 dark:aria-selected:text-amber"
                    >
                      <Icon size={15} className="flex-shrink-0" />
                      {cmd.label}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2 dark:border-dark-border">
            <p className="text-[10px] text-ink-muted">
              <kbd className="font-mono">↑↓</kbd> navigate ·{" "}
              <kbd className="font-mono">↵</kbd> select ·{" "}
              <kbd className="font-mono">ESC</kbd> close
            </p>
          </div>
        </Command>
      </div>
    </div>
  );
}
