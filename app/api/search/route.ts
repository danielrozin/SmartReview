import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const categorySlug = searchParams.get("category");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  try {
    const where: Record<string, unknown> = {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: { smartScore: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        image: true,
        smartScore: true,
        reviewCount: true,
        priceMin: true,
        priceMax: true,
        priceCurrency: true,
        category: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json({ products, query: q });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
