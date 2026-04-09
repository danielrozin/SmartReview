import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email } = await req.json();

  if (!email || !name) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
