import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        aiSummary: true,
        specs: { orderBy: { group: "asc" } },
        recurringIssues: { orderBy: { mentionCount: "desc" } },
        comparisons: true,
        faqs: true,
        youtubeVideos: true,
        reviews: {
          where: { status: "published" },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatar: true, trustLevel: true },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
