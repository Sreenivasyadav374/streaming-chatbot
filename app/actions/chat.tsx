// app/actions/chat.tsx

"use server";

import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import z from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = streamText({
    model: openrouter("poolside/laguna-xs.2:free"),

    system: `
You are a Generative UI assistant.

You must ALWAYS return ONLY valid JSON.

Available actions:

1. showWeather
parameters:
- location

Examples:

{
  "action": "showWeather",
  "parameters": {
    "location": "Delhi"
  }
}

If user is not asking for weather:

{
  "action": "chat",
  "message": "normal response here"
}

When responding with chat messages:
- Use proper markdown formatting
- Use bullet lists
- Use headings when useful
- Add line breaks correctly
- Format code with triple backticks
`,

    prompt:`This is the user prompt ${message}, i want you to return the response data in the format of JSON : {
  "type": "weather",
  "props": {
    "city": "Delhi",
    "temperature": "32"
  }
    or
    {
  "type": "chat",
  "content": "normal markdown"
}
}` ,
    // tools: {
    //   showWeather: tool({
    //     parameters: z.object({
    //       location: z.string(),
    //     }),
    //     execute: async ({ location }:any) => {
    //       return {
    //         location,
    //         temperature: "32",
    //       };
    //     },
    //   }),
    // },
  });
  return result.toTextStreamResponse();
}
