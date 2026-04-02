import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ plan: "free", isActive: false });
  }

  const userId = (session.user as { id: string }).id;
  const status = await getUserSubscription(userId);

  return NextResponse.json(status);
}
