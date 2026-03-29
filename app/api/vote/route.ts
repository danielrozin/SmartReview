import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, voteType, reviewId, threadId, commentId } = body;

    if (!userId || !voteType) {
      return NextResponse.json({ error: "Missing required fields: userId, voteType" }, { status: 400 });
    }

    const targets = [reviewId, threadId, commentId].filter(Boolean);
    if (targets.length !== 1) {
      return NextResponse.json(
        { error: "Exactly one of reviewId, threadId, or commentId must be provided" },
        { status: 400 }
      );
    }

    const validVoteTypes = ["upvote", "downvote", "helpful", "agree", "same_issue", "owner_confirmed"];
    if (!validVoteTypes.includes(voteType)) {
      return NextResponse.json({ error: `Invalid voteType. Must be one of: ${validVoteTypes.join(", ")}` }, { status: 400 });
    }

    // Check for existing vote and toggle
    const existingWhere: Record<string, unknown> = { userId, voteType };
    if (reviewId) existingWhere.reviewId = reviewId;
    if (threadId) existingWhere.threadId = threadId;
    if (commentId) existingWhere.commentId = commentId;

    const existing = await prisma.vote.findFirst({ where: existingWhere });

    if (existing) {
      // Remove vote (toggle off)
      await prisma.vote.delete({ where: { id: existing.id } });

      // Decrement counter
      if (reviewId && voteType === "helpful") {
        await prisma.review.update({ where: { id: reviewId }, data: { helpfulCount: { decrement: 1 } } });
      } else if (threadId) {
        const field = voteType === "upvote" ? "upvotes" : voteType === "downvote" ? "downvotes" : null;
        if (field) await prisma.discussionThread.update({ where: { id: threadId }, data: { [field]: { decrement: 1 } } });
      } else if (commentId) {
        const field = voteType === "upvote" ? "upvotes" : voteType === "downvote" ? "downvotes" : voteType === "helpful" ? "helpfulCount" : null;
        if (field) await prisma.comment.update({ where: { id: commentId }, data: { [field]: { decrement: 1 } } });
      }

      return NextResponse.json({ action: "removed" });
    }

    // Create vote
    await prisma.vote.create({
      data: {
        userId,
        voteType,
        reviewId: reviewId || null,
        threadId: threadId || null,
        commentId: commentId || null,
      },
    });

    // Increment counter
    if (reviewId && voteType === "helpful") {
      await prisma.review.update({ where: { id: reviewId }, data: { helpfulCount: { increment: 1 } } });
    } else if (threadId) {
      const field = voteType === "upvote" ? "upvotes" : voteType === "downvote" ? "downvotes" : null;
      if (field) await prisma.discussionThread.update({ where: { id: threadId }, data: { [field]: { increment: 1 } } });
    } else if (commentId) {
      const field = voteType === "upvote" ? "upvotes" : voteType === "downvote" ? "downvotes" : voteType === "helpful" ? "helpfulCount" : null;
      if (field) await prisma.comment.update({ where: { id: commentId }, data: { [field]: { increment: 1 } } });
    }

    return NextResponse.json({ action: "created" }, { status: 201 });
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
