/**
 * lib/fonts.ts — next/font configuration.
 *
 * next/font downloads fonts at BUILD TIME and serves them from the
 * same origin as your app. Benefits vs Google Fonts CDN:
 *   • Zero layout shift (font is available before first paint)
 *   • No Google Fonts network request → faster TTFB
 *   • Privacy — user IP never sent to Google
 *
 * CSS variables are injected via <body className={...}> in layout.tsx,
 * then consumed in tailwind.config.ts as font families.
 *
 * MODULE 7 USES:
 *   Inter + Playfair Display.
 *   Here we use DM Sans + DM Serif Display to match the Module 4 design.
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
