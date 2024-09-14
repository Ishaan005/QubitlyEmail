import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recentEmails = await prisma.email.findMany({
      where: {
        user: {
          userId: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        id: true,
        subject: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(recentEmails);
  } catch (error) {
    console.error("Error in GET /api/emails/recent:", error);
    return NextResponse.json({ error: "Failed to fetch recent emails" }, { status: 500 });
  }
}