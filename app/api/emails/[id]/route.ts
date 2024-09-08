import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emailId = params.id;
    const email = await prisma.email.findUnique({
      where: {
        id: emailId,
        user: {
          userId: userId,
        },
      },
    });

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json(email);
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json({ error: "Failed to fetch email" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emailId = params.id;
    const { subject, content, prompt } = await request.json();

    const updatedEmail = await prisma.email.update({
      where: {
        id: emailId,
        user: {
          userId: userId,
        },
      },
      data: {
        subject,
        content,
        prompt,
      },
    });

    return NextResponse.json(updatedEmail);
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 });
  }
}