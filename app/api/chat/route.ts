// app/api/chat/route.ts

import { streamText, tool, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

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
You are an AI assistant with access to tools.

Rules:
- For weather-related questions ALWAYS use the showWeather tool.
- For generating lists, plans, or checklists, ALWAYS use the showTasks tool.
- CRITICAL: When using the showTasks tool, you must explicitly invent or extract an array of items for the 'tasks' array and a string for the 'title'. Do not leave the arguments empty.
- For all other questions respond normally in markdown.
`,

      tools: {
        showWeather: tool({
          description:
            "Get current weather for a specific city. Always provide the city name in the location parameter.",

          parameters: z.object({
            location: z.string().describe("The city name to get weather for"),
          }),

          execute: async ({ location }) => {
            return {
              city: location,
              temperature: "32",
            };
          },
        }),
        showTasks: tool({
          description:
            "Create task title and check list of tasks for specific context.",
          parameters: z.object({
            title: z.string().describe("The name to create for the task list"),
            tasks: z
              .array(
                z.object({
                  id: z.string().describe("Unique random string id"),
                  text: z.string().describe("The task description"),
                  completed: z
                    .boolean()
                    .default(false)
                    .describe("Set false by default"),
                }),
              )
              .describe("The list of tasks"),
          }),
          execute: async ({ title, tasks }) => {
            return { title, tasks };
          },
        }),
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
