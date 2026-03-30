import type { Metadata } from "next";
import "./globals.css";
import { fontSans, fontSerif } from "@/lib/fonts";
import { DEFAULT_METADATA } from "@/lib/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedCartDrawer } from "@/components/layout/AnimatedCartDrawer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

/**
 * Root Layout — Module 7 changes:
 *
 * 1. next/font: fontSans and fontSerif are applied to <html> via className.
 *    This injects the CSS variables --font-inter and --font-playfair into the
 *    document root, making them available to Tailwind's font-sans and font-serif.
 *
 * 2. Metadata: uses DEFAULT_METADATA from lib/metadata.ts as the base.
 *    Each page/route overrides specific fields (title, description, OG).
 *    metadataBase: new URL(BASE_URL) makes relative OG image URLs work.
 *
 * 3. <html> className pattern:
 *    fontSans.variable = "--font-inter"   → CSS var available everywhere
 *    fontSerif.variable = "--font-playfair" → CSS var available everywhere
 */
export const metadata: Metadata = DEFAULT_METADATA;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // Inject both font CSS variables onto the root element
      className={`${fontSans.variable} ${fontSerif.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-parchment dark:bg-dark-bg">
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
