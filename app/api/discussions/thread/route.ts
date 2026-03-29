import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: threadBody, threadType, authorId, productId, categoryId, tags } = body;

    if (!title || !threadBody || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields: title, body, authorId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: authorId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const thread = await prisma.discussionThread.create({
      data: {
        title,
        body: threadBody,
        threadType: threadType || "discussion",
        authorId,
        productId: productId || null,
        categoryId: categoryId || null,
        tags: tags || [],
      },
      include: {
        author: { select: { id: true, username: true, displayName: true, avatar: true, trustLevel: true } },
      },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const categoryId = searchParams.get("categoryId");
  const threadType = searchParams.get("threadType");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  try {
    const where: Record<string, unknown> = {};
    if (productId) where.productId = productId;
    if (categoryId) where.categoryId = categoryId;
    if (threadType) where.threadType = threadType;

    const [threads, total] = await Promise.all([
      prisma.discussionThread.findMany({
        where,
        orderBy: [{ isPinned: "desc" }, { lastActivityAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, username: true, displayName: true, avatar: true, trustLevel: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.discussionThread.count({ where }),
    ]);

    return NextResponse.json({ threads, total, page, limit });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
