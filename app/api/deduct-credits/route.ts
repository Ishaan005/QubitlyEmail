import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { creditAmount } = await request.json();

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { credits: true },
    });

    if (!user || user.credits < creditAmount) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { credits: { decrement: creditAmount } },
    });

    return NextResponse.json({ credits: updatedUser.credits });
  } catch (error) {
    console.error("Error deducting credit:", error);
    return NextResponse.json({ error: "Failed to deduct credit" }, { status: 500 });
  }
}