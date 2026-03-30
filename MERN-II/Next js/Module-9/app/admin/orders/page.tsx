import type { Metadata } from "next";
import { LiveOrderFeed } from "@/components/admin/LiveOrderFeed";

export const metadata: Metadata = { title: "Live Orders — Admin" };

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-normal dark:text-white">Live Orders</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Real-time feed via useSocket · new orders slide in with Framer Motion
        </p>
      </div>
      <div className="max-w-2xl"><LiveOrderFeed /></div>
    </div>
  );
}
