import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { router } from "./router";
import "./styles/index.css";

/**
 * Provider order (outside → inside):
 *   StrictMode → QueryClientProvider → RouterProvider
 *
 * RouterProvider replaces <BrowserRouter> — it takes the router object
 * from createBrowserRouter() and makes routing context available everywhere.
 */
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  </StrictMode>,
);
