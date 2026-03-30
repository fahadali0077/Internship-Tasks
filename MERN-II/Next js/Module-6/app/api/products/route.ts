import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchProducts } from "@/lib/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    let products = await fetchProducts();

    if (category && category !== "All") {
      products = products.filter((p) => p.category === category);
    }

    if (sort === "price-asc") {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      products = [...products].sort((a, b) => b.rating - a.rating);
    }

    return NextResponse.json(
      { success: true, data: products, count: products.length },
      {
        status: 200,
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
      },
    );
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
