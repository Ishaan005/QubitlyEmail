import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { subject, content, userId } = body;

    try {
        const email = await prisma.email.create({
            data: {
                subject,
                content,
                userId,
            },
        })
        return NextResponse.json(email)
    } catch(error) {
        return NextResponse.json({error: "Failed to create email"}, {status: 500})
    }
}