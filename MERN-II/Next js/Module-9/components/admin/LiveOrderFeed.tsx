"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/useSocket";
import type { AdminOrder } from "@/lib/adminData";
import { Wifi, WifiOff } from "lucide-react";

const STATUS_STYLES: Record<AdminOrder["status"], string> = {
  pending: "bg-amber-dim text-amber",
  processing: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};


const MAX_ORDERS = 15;

export function LiveOrderFeed() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const handleNewOrder = useCallback((order: AdminOrder) => {
    setOrders((prev) => [order, ...prev].slice(0, MAX_ORDERS));
  }, []);

  const { isConnected, orderCount } = useSocket(handleNewOrder);

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-dark-border">
        <div>
          <h3 className="font-serif text-lg font-normal dark:text-white">Live Orders</h3>
          <p className="text-xs text-ink-muted">{orderCount} received this session</p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isConnected
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-50 text-red-500 dark:bg-red-900/20"
            }`}
        >
          {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isConnected ? "Live" : "Connecting…"}
        </span>
      </div>

      {/* Order list */}
      <div className="divide-y divide-border/40 dark:divide-dark-border" style={{ minHeight: 200 }}>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <span className="text-2xl animate-pulse">📡</span>
            <p className="text-sm text-ink-muted">
              {isConnected ? "Waiting for orders…" : "Connecting to live feed…"}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ x: -24, opacity: 0, height: 0 }}
                animate={{ x: 0, opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 px-5 py-3">
                  {/* Status dot */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-parchment dark:bg-dark-surface-2">
                    <span className="text-sm" aria-hidden="true">📦</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-ink dark:text-white">
                        {order.id}
                      </p>
                      <span className="text-xs tabular-nums font-bold text-ink dark:text-white">
                        ${order.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p className="truncate text-xs text-ink-muted">{order.customer}</p>
                      <span className="text-border">·</span>
                      <p className="truncate text-xs text-ink-muted max-w-[120px]">{order.product}</p>
                    </div>
                  </div>

                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[order.status]
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
