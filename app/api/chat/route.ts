// app/api/chat/route.ts

import { streamText, tool, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { allTools } from "./tools";

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = googleProvider("gemini-2.5-flash");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: model,

      messages: await convertToModelMessages(messages),

      system: `
You are an AI assistant with access to specialized UI rendering tools.

Rules:
- For weather-related questions, ALWAYS use the showWeather tool.
- For generating lists, plans, or checklists, ALWAYS use the showTasks tool.
- For generating culinary recipes, food preparation steps, or meal plans, ALWAYS use the createRecipe tool. CRITICAL: Provide all structural details matching the schema parameters perfectly. Do not output raw markdown for recipes.
- For all other standard questions, respond normally in markdown.
`,

      tools: {
        showWeather: allTools.showWeather,
        showTasks: allTools.showTasks,
        showRecipe: allTools.showRecipe,
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);

    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
