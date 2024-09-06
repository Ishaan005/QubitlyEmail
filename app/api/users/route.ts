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
        const user = await prisma.user.create({
            data: {
                name,
                email,
                userId,
            }
        })
        return NextResponse.json(user)
    } catch(error) {
        return NextResponse.json({error: "Failed to create user"}, {status: 500})
    }
}