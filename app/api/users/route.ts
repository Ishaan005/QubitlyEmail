import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request:Request) {
    const body = await request.json()
    const { name, email } = body

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
            }
        })
        return NextResponse.json(user)
    } catch(error) {
        return NextResponse.json({error: "Failed to create user"}, {status: 500})
    }
}