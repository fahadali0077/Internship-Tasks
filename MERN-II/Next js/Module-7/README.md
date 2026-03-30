# MERN-II · Module 7 — SEO-Optimised Product Catalogue

> **Stack:** Next.js 15 · next/font · next/image · Sitemap · Bundle Analyzer

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run analyze      # open bundle treemap (runs build first)
npm run type-check
```

## Requirements → Implementation

| Requirement | File |
|---|---|
| generateMetadata for /products/[id] | `app/(shop)/products/[id]/page.tsx` → `buildProductMetadata()` |
| OG image, description, Twitter card | `lib/metadata.ts` → `buildProductMetadata()` |
| next/image blur placeholder + priority on hero | `lib/imageUtils.ts` + `ProductCard.tsx` + `page.tsx` |
| next/font: Inter body + Playfair Display headings | `lib/fonts.ts` + `app/layout.tsx` |
| sitemap.ts auto-generating product URLs | `app/sitemap.ts` |
| Streaming per ProductCard row | `components/products/ProductRow.tsx` + `ProductGrid.tsx` |
| Bundle analyzer | `next.config.ts` + `package.json` analyze script |

## Mental Models

### next/font vs Google Fonts CDN

```
Before (Modules 4–6):              After (Module 7):
────────────────────               ────────────────────
<link href="fonts.googleapis.com"> fonts.ts → next/font
→ render-blocking request          → downloaded at build time
→ layout shift (FOUT)              → zero layout shift
→ Google tracking                  → self-hosted, privacy-safe
→ depends on external CDN          → served from your domain
```

### generateMetadata flow

```
GET /products/p-001
  ↓
generateMetadata({ params: { id: "p-001" } })
  ↓ fetchProductById("p-001")
  ↓ buildProductMetadata(product)
  ↓ returns { title, description, openGraph, twitter }
  ↓
Next.js injects into <head>:
  <title>Sony WH-1000XM5 Headphones | MERNShop</title>
  <meta name="description" content="..." />
  <meta property="og:image" content="https://picsum.photos/..." />
  <meta name="twitter:card" content="summary_large_image" />
```

### next/image sizes prop — why it matters

```
Without sizes (default 100vw):
  → browser downloads 1200px image for a 300px card
  → 4× wasted bandwidth per card × 12 cards = very slow

With sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw":
  → browser downloads exactly the right size for the current viewport
  → Next.js generates srcset: 300w, 600w, 1200w, browser picks smallest adequate
```

### Per-row Streaming

```
ProductGrid (async) → fetchProducts() once
  → chunks products into rows of 4
  → Row 1 (Suspense) → cards appear → priority images preloaded
  → Row 2 (Suspense) → cards appear → lazy images load
  → Row 3 (Suspense) → cards appear → lazy images load
  User sees content progressively, not a single pop of all cards.
```

### Bundle Analyzer

```
npm run analyze
  → ANALYZE=true next build
  → .next/analyze/client.html  (opens in browser)
  → .next/analyze/server.html

Look for:
  ✅ Each page bundle only contains its own code
  ✅ framer-motion in a shared chunk (not duplicated per page)
  ✅ Server Component pages: tiny or zero client JS
  ✅ /products and /products/[id] share ProductCard bundle
```

### JSON-LD Structured Data

```html
<!-- Injected on /products/p-001 -->
<script type="application/ld+json">
{
  "@type": "Product",
  "name": "Sony WH-1000XM5",
  "offers": { "price": 279.99, "priceCurrency": "USD" },
  "aggregateRating": { "ratingValue": 4.8, "reviewCount": 2341 }
}
</script>
```
Google can show product price and star rating directly in search results.

## Verification Checklist

### SEO / Metadata
- [ ] `curl -s http://localhost:3000/products/p-001 | grep "<title>"` → product name
- [ ] Same curl → `<meta property="og:image"` contains picsum URL
- [ ] Same curl → `<meta name="twitter:card"` = "summary_large_image"
- [ ] Same curl → `<script type="application/ld+json">` present

### Fonts
- [ ] Headings (h1, h2, product names) render in Playfair Display (serif)
- [ ] Body text renders in Inter (sans-serif)
- [ ] DevTools → Network → Font: fonts served from `/_next/static/media/` (not googleapis.com)

### Images
- [ ] DevTools → Network → Img: requests go to `/_next/image?url=...` (Next optimisation)
- [ ] Hero product images show blur placeholder briefly on slow network (throttle to Slow 3G)
- [ ] `priority` images preloaded: DevTools → Network → find `<link rel="preload" as="image">`
- [ ] Page source: first row img tags have `loading="eager"`, rest have `loading="lazy"`

### Sitemap
- [ ] Visit http://localhost:3000/sitemap.xml → valid XML with 16 URLs
- [ ] All /products/p-001 through /products/p-012 listed

### Robots
- [ ] Visit http://localhost:3000/robots.txt → Disallow: /api/ and /auth/

### Bundle Analyzer
```bash
npm run analyze
```
- [ ] client.html opens → each route is a separate chunk
- [ ] framer-motion appears as a shared chunk
- [ ] Server-only pages (/products listing) have small client bundle

### TypeScript
```bash
npm run type-check   # must print nothing
```
