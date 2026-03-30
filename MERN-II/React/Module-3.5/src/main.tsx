import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import "./styles/index.css";
import App from "./App";

/**
 * Module 3 main.tsx — QueryClientProvider wraps the whole app.
 *
 * QueryClientProvider injects the queryClient into React context so that
 * every useQuery / useMutation call in the tree can access the same cache.
 *
 * ReactQueryDevtools: floating panel (bottom-right in dev) showing:
 *   - All active queries and their status (fresh / stale / fetching / error)
 *   - Cache contents and last-fetched timestamps
 *   - Manual refetch / invalidate controls
 * Auto-removed from production builds.
 */
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  </StrictMode>,
);
