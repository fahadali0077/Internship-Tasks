import type { Metadata } from "next";
import type { Product } from "@/types";


export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MERNShop",
    template: "%s | MERNShop",
  },
  description:
    "Production-grade e-commerce frontend built with Next.js 15, TypeScript, and Tailwind CSS.",
  openGraph: {
    type: "website",
    siteName: "MERNShop",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mernshop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

/**
 * buildProductMetadata — generates rich metadata for a product detail page.
 *
 * OG image: we use the product's existing Picsum image.
 * In a real app, you'd generate a custom OG image via Next.js ImageResponse
 * (app/api/og/route.tsx) for branded social cards.
 */
export function buildProductMetadata(product: Product): Metadata {
  const title = product.name;
  const description =
    product.description ??
    `Buy ${product.name} — ${product.category} — rated ${product.rating}/5 by ${product.reviewCount.toLocaleString()} customers.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: product.image,
          width: 600,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}
