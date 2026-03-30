import type { Metadata } from "next";
import "./globals.css";
import { dmSans, dmSerif } from "@/lib/fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "MERNShop",
    template: "%s | MERNShop",
  },
  description:
    "A production-grade e-commerce frontend built with Next.js 15 App Router, TypeScript, Tailwind CSS, and Shadcn/ui.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-parchment font-sans">
        {/* CartDrawer — Client Component, overlays everything */}
        <CartDrawer />

        {/* Navbar — Server Component (Client islands inside) */}
        <Navbar />

        {/* Page content */}
        <main className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-10">
          {children}
        </main>

        {/* Footer — Server Component */}
        <Footer />
      </body>
    </html>
  );
}
