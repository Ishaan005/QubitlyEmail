import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalEmails = await prisma.email.count({
      where: {
        user: {
          userId: userId,
        },
      },
    });
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const generatedThisWeek = await prisma.email.count({
      where: {
        user: {
          userId: userId,
        },
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // Note: Average generation time is not stored in the database
    // You would need to implement a separate mechanism to track this
    const averageGenerationTime = 2.5; // Placeholder value

    const stats = {
      totalEmails,
      generatedThisWeek,
      averageGenerationTime,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching email stats:", error);
    return NextResponse.json({ error: "Failed to fetch email stats" }, { status: 500 });
  }
}