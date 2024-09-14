import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"

export async function POST(request:NextRequest) {
    const { userId } = getAuth(request)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json()
    const { name, email } = body

    try {
        const user = await prisma.user.upsert({
            where: { userId },
            update: { name, email },
            create: { userId, name, email },
        })
        return NextResponse.json(user)
    } catch(error) {
        console.error("Error creating/updating user:", error);
        return NextResponse.json({ error: "Failed to create/update user" }, { status: 500 });
    }
}