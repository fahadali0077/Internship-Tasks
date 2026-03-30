import type { Metadata } from "next";
import { STAT_CARDS, REVENUE_DATA, ADMIN_PRODUCTS } from "@/lib/adminData";
import { StatCards } from "@/components/admin/StatCards";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { LiveOrderFeed } from "@/components/admin/LiveOrderFeed";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-3xl font-normal dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Press <kbd className="rounded border border-border bg-cream px-1 font-mono text-xs dark:border-dark-border dark:bg-dark-surface-2 dark:text-white">⌘K</kbd> to open the command palette
        </p>
      </div>

      {/* Stat cards */}
      <StatCards cards={STAT_CARDS} />

      {/* Revenue chart + Live feed */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <RevenueChart data={REVENUE_DATA} />
        <LiveOrderFeed />
      </div>

      {/* Products table */}
      <ProductsTable products={ADMIN_PRODUCTS} />
    </div>
  );
}
