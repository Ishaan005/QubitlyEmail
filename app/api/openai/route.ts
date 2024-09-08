import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
    const { prompt, existingHtml } = await request.json()

    try {
        const response = await openai.chat.completions.create({
            messages: [
                {"role": "system", "content": "You are an expert HTML email designer. Modify the existing HTML based on the user's prompt. If no existing HTML is provided, generate a new responsive email template. Your output MUST contain only valid HTML code. Do not use this: ```html"},
                {"role": "user", "content": `Existing HTML: ${existingHtml || "No existing HTML"}\n\nUser prompt: ${prompt}`}
            ],
            model: "gpt-4o-mini",
          });
          return NextResponse.json(response.choices[0].message)
    } catch(e) {
        return NextResponse.json({ error: "Failes to fetch response from OpenAI" }, { status: 500 })
    }
}