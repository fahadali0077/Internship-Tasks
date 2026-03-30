/**
 * lib/fonts.ts — next/font configuration.
 *
 * Self-hosted via next/font: fonts downloaded at build time, served from
 * the same origin. Benefits over @import url(https://fonts.googleapis.com/...):
 *   ✅ Zero layout shift — available before first paint
 *   ✅ No external request — faster TTFB, works offline, GDPR-friendly
 *   ✅ Automatic font subsetting by next/font
 *
 * CSS variables are injected via className on <html> in layout.tsx,
 * consumed by tailwind.config.ts as the font-family values.
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
