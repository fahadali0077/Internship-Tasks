import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vite configuration — Module 3.5
 *
 * KEY DECISIONS:
 *
 * 1. @vitejs/plugin-react
 *    Uses Babel to transform JSX and enables React Fast Refresh (HMR).
 *    React Compiler is opt-in from React 19; we keep Babel for now and
 *    add the compiler in Module 5 when we move to Next.js + Turbopack.
 *
 * 2. Path alias  @/ → ./src/
 *    Matches the "paths" entry in tsconfig.json so both TypeScript and Vite
 *    resolve @/components/... identically.
 *    Without this, Vite would serve the files but tsc --noEmit would error.
 *    Without tsconfig.json "paths", tsc would error but Vite would serve fine.
 *    Both must agree.
 *
 * 3. No explicit server.port — defaults to 5173, which is fine.
 *    In Module 4 (Next.js) this file goes away; Next handles dev server config
 *    via next.config.ts.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @/ maps to ./src/ — mirrors tsconfig.json "paths"
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: false, // set to true if you want the browser to open automatically
  },
  build: {
    // Warn when a chunk exceeds 500kB (default is 500kB — explicit for visibility)
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk for better caching
        manualChunks: {
          vendor: ["react", "react-dom"],
          query: ["@tanstack/react-query"],
          zustand: ["zustand"],
          forms: ["react-hook-form", "zod", "@hookform/resolvers"],
        },
      },
    },
  },
});
