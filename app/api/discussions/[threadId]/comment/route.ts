import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const body = await request.json();
    const { authorId, body: commentBody, parentId } = body;

    if (!authorId || !commentBody) {
      return NextResponse.json(
        { error: "Missing required fields: authorId, body" },
        { status: 400 }
      );
    }

    const thread = await prisma.discussionThread.findUnique({ where: { id: threadId } });
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent || parent.threadId !== threadId) {
        return NextResponse.json({ error: "Parent comment not found in this thread" }, { status: 404 });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        threadId,
        authorId,
        body: commentBody,
        parentId: parentId || null,
      },
      include: {
        author: { select: { id: true, username: true, displayName: true, avatar: true, trustLevel: true } },
      },
    });

    await prisma.discussionThread.update({
      where: { id: threadId },
      data: {
        commentCount: { increment: 1 },
        lastActivityAt: new Date(),
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

    const comments = await prisma.comment.findMany({
      where: { threadId, parentId: null },
      orderBy: [{ isTopAnswer: "desc" }, { upvotes: "desc" }, { createdAt: "asc" }],
      include: {
        author: { select: { id: true, username: true, displayName: true, avatar: true, trustLevel: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, username: true, displayName: true, avatar: true, trustLevel: true } },
          },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
