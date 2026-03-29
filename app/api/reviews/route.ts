import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      userId,
      headline,
      rating,
      verifiedPurchase,
      verificationTier,
      timeOwned,
      experienceLevel,
      pros,
      cons,
      reliabilityRating,
      easeOfUseRating,
      valueRating,
      body: reviewBody,
      authorName,
    } = body;

    if (!productId || !headline || !rating || !reviewBody || !authorName) {
      return NextResponse.json(
        { error: "Missing required fields: productId, headline, rating, body, authorName" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: userId || null,
        headline,
        rating,
        verifiedPurchase: verifiedPurchase || false,
        verificationTier: verificationTier || "unverified",
        timeOwned: timeOwned || null,
        experienceLevel: experienceLevel || "beginner",
        pros: pros || [],
        cons: cons || [],
        reliabilityRating: reliabilityRating || null,
        easeOfUseRating: easeOfUseRating || null,
        valueRating: valueRating || null,
        body: reviewBody,
        authorName,
        status: "pending",
      },
    });

    // Update product review count and rating distribution
    const ratingField = `rating${rating}` as const;
    await prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount: { increment: 1 },
        [ratingField]: { increment: 1 },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const status = searchParams.get("status") || "published";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  try {
    const where: Record<string, unknown> = { status };
    if (productId) where.productId = productId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, username: true, displayName: true, avatar: true, trustLevel: true } } },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({ reviews, total, page, limit });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
