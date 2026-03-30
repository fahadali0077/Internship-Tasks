import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchProductById } from "@/lib/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await fetchProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product "${id}" not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: product },
      {
        status: 200,
        headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" },
      },
    );
  } catch (error) {
    console.error("[GET /api/products/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
