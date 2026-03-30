/**
 * lib/fonts.ts — next/font configuration.
 *
 * next/font downloads fonts at BUILD TIME and serves them from the
 * same origin as the app. Compared to a Google Fonts CDN @import:
 *
 *   ✅ Zero layout shift — font is available before first paint
 *   ✅ No external network request → faster TTFB + privacy
 *   ✅ Works offline / in restricted networks
 *   ✅ Automatic font subsetting
 *
 * CSS variables are injected via className on <html> in layout.tsx,
 * then consumed by tailwind.config.ts as font-family values.
 *
 * MODULE 7 UPGRADE:
 *   Swap DM Sans → Inter, DM Serif Display → Playfair Display
 *   for the SEO-optimised catalogue module. The pattern stays identical.
 */

import { DM_Sans, DM_Serif_Display } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});
