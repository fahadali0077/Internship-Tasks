import type { Metadata } from "next";
import "./globals.css";
import { dmSans, dmSerif } from "@/lib/fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedCartDrawer } from "@/components/layout/AnimatedCartDrawer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: { default: "MERNShop", template: "%s | MERNShop" },
  description: "Next.js 15 · Server Actions · Cookie-based cart · Middleware protection",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-parchment font-sans dark:bg-dark-bg">
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
