// app/api/chat/tools.ts
import { tool } from "ai";
import { z } from "zod";

export const showWeather = tool({
  description: "Get current weather for a specific city. Always provide the city name in the location parameter.",
  // Use parameters instead of inputSchema for standard Vercel AI SDK compatibility
  inputSchema: z.object({
    location: z.string().describe("The city name to get weather for"),
  }),
  execute: async ({ location }) => {
    return {
      city: location,
      temperature: "32",
    };
  },
});

export const showTasks = tool({
  description: "Create task title and check list of tasks for specific context.",
  inputSchema: z.object({
    title: z.string().describe("The name to create for the task list"),
    tasks: z.array(
      z.object({
        id: z.string().describe("Unique random string id"),
        text: z.string().describe("The task description"),
        completed: z.boolean().default(false).describe("Set false by default"),
      })
    ).describe("The list of tasks"),
  }),
  execute: async ({ title, tasks }) => {
    return { title, tasks };
  },
});

// Bundle everything together for clean imports
export const allTools = {
  showWeather,
  showTasks,
};
