import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
    const { prompt, existingHtml } = await request.json()

    try {
        const response = await openai.chat.completions.create({
            messages: [
                {
                    "role": "system",
                    "content": `You are an expert HTML email designer. Create or modify responsive, cross-client compatible HTML email templates based on the user's prompt. Follow these guidelines:

                    1. Use inline CSS styles for maximum compatibility.
                    2. Use table-based layouts for better email client support.
                    3. Use web-safe fonts or fallback font stacks.
                    4. Ensure images have alt text and are hosted on a reliable CDN.
                    5. Use media queries for responsive design, but provide a mobile-first approach.
                    6. Avoid using JavaScript or external stylesheets.
                    7. Use percentage-based widths for flexibility.
                    8. Test thoroughly across different email clients.

                    Your output MUST be valid HTML code without any markdown formatting.`
                },
                {"role": "user", "content": `Existing HTML: ${existingHtml || "No existing HTML"}\n\nUser prompt: ${prompt}`}
              ],
            model: "gpt-4o-mini",
          });
          if (!response.choices || response.choices.length === 0) {
            throw new Error("No response from OpenAI");
        }

        return NextResponse.json({ content: response.choices[0].message.content })
    } catch(e) {
        console.error("Error in OpenAI API call:", e);
        return NextResponse.json({ error: "Failed to fetch response from OpenAI" }, { status: 500 })
    }
}