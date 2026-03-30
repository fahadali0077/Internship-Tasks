"use client";

import { motion } from "framer-motion";
import type { StatCard } from "@/lib/adminData";

interface StatCardsProps { cards: StatCard[]; }


export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-border bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-2xl" aria-hidden="true">{card.icon}</span>
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${card.change >= 0
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}
            >
              {card.change >= 0 ? "▲" : "▼"} {Math.abs(card.change)}%
            </span>
          </div>
          <p className="text-2xl font-bold tabular-nums dark:text-white">{card.value}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-muted">
            {card.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
