import { useState, useCallback } from "react";


export function useCart() {
  const [cartIds, setCartIds] = useState<ReadonlySet<string>>(new Set());

  const addItem = useCallback((id: string) => {
    setCartIds((prev) => new Set([...prev, id]));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setCartIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isInCart = useCallback(
    (id: string) => cartIds.has(id),
    [cartIds],
  );

  return { cartIds, addItem, removeItem, toggle, isInCart, count: cartIds.size };
}
