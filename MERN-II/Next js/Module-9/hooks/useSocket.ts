"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { AdminOrder } from "@/lib/adminData";
import { generateMockOrder } from "@/lib/adminData";


interface UseSocketReturn {
  isConnected: boolean;
  orderCount: number;
}

export function useSocket(onOrder: (order: AdminOrder) => void): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onOrderRef = useRef(onOrder);

  // Keep ref in sync with the latest onOrder callback (avoids stale closure)
  useEffect(() => {
    onOrderRef.current = onOrder;
  }, [onOrder]);

  useEffect(() => {
    // Simulate connection delay (real socket.io-client emits "connect" event)
    const connectTimer = setTimeout(() => {
      setIsConnected(true);

      // Simulate receiving live order events every 3–6 seconds
      intervalRef.current = setInterval(() => {
        const newOrder = generateMockOrder();
        onOrderRef.current(newOrder);
        setOrderCount((n) => n + 1);
      }, Math.random() * 3000 + 3000); // 3–6s jitter for realism
    }, 800); // connection delay

    // CLEANUP — runs on unmount to prevent memory leaks and stale state
    return () => {
      clearTimeout(connectTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsConnected(false);
    };
  }, []); // empty array — connect once on mount, disconnect on unmount

  return { isConnected, orderCount };
}
