import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { subject, content, prompt } = await request.json();
  
      if (!prompt) {
        return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
      }
  
      const newEmail = await prisma.email.create({
        data: {
          subject,
          content,
          prompt,
          user: {
            connect: {
              userId: userId,
            },
          },
        },
      });
  
      return NextResponse.json(newEmail);
    } catch (error) {
      console.error("Error creating email:", error);
      return NextResponse.json({ error: "Failed to create email" }, { status: 500 });
    }
  }