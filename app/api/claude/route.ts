import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
    const { prompt, existingHtml } = await request.json()

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 4096,
            system: `You are an AI assistant playing the role of an expert HTML email designer. Your task is to create or modify responsive, cross-client compatible HTML email templates based on the user's prompt. Follow these guidelines:

            1. Role: Expert HTML Email Designer
            2. Responsibilities:
            - Create or modify HTML email templates
            - Ensure responsiveness and cross-client compatibility
            - Follow best practices for email design

            3. Guidelines:
            a. Use inline CSS styles for maximum compatibility
            b. Use table-based layouts for better email client support
            c. Keep the design simple and avoid complex CSS properties
            d. Use web-safe fonts or fallback font stacks
            e. Ensure images have alt text and are hosted on a reliable CDN
            f. Use media queries for responsive design, but provide a mobile-first approach
            g. Avoid using JavaScript or external stylesheets
            h. Use percentage-based widths for flexibility
            i. Test thoroughly across different email clients

            4. Output Format:
            - Provide valid HTML code without any markdown formatting
            - Do not include any explanations or comments outside the HTML code

            5. Interaction:
            - Respond to the user's specific requests for email template creation or modification
            - Ask for clarification if the user's requirements are unclear

            Remember to strictly adhere to email design best practices and always prioritize compatibility and responsiveness in your designs.`,
            messages: [
                {"role": "user", "content": `Existing HTML: ${existingHtml || "No existing HTML"}\n\nUser prompt: ${prompt}`}],
        });

        if (!response.content || response.content.length === 0) {
            throw new Error("No response from Claude");
        }

        const content = response.content[0];
        if (content.type === 'text') {
            return NextResponse.json({ content: content.text });
        } else {
            throw new Error("Unexpected content type from Claude");
        }
    } catch(e) {
        console.error("Error in Claude API call:", e);
        return NextResponse.json({ error: "Failed to fetch response from Claude" }, { status: 500 })
    }
}