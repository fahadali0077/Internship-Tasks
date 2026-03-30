import type { Metadata } from "next";
import "./globals.css";
import { dmSans, dmSerif } from "@/lib/fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedCartDrawer } from "@/components/layout/AnimatedCartDrawer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: { default: "MERNShop", template: "%s | MERNShop" },
  description: "Next.js 15 · Framer Motion · Dark Mode · RHF + Zod · Shadcn/ui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /**
     * Font variables injected on <html> so both CSS-variable and
     * Tailwind font-family utilities work everywhere in the tree.
     *
     * suppressHydrationWarning: next-themes sets class="dark" on <html>
     * server-side vs client-side, which would normally cause a hydration
     * warning. This prop silences it safely.
     */
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-parchment font-sans dark:bg-dark-bg">
        {/*
          ThemeProvider must wrap everything to supply the theme context.
          It reads/writes localStorage and sets class="dark" on <html>.
        */}
        <ThemeProvider>
          <AnimatedCartDrawer />
          <Navbar />
          <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8 md:px-6 md:py-10">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
