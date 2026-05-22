// app/api/chat/tools.ts
import { tool } from "ai";
import { recipeSchema, weatherSchema, taskSchema } from "@/app/api/chat/schema";

export const showWeather = tool({
  description:
    "Get current weather for a specific city. Always provide the city name in the location parameter.",
  inputSchema: weatherSchema,
  execute: async ({ location }) => {
    return {
      city: location,
      temperature: "32",
    };
  },
});

export const showTasks = tool({
  description:
    "Create task title and check list of tasks for specific context.",
  inputSchema: taskSchema,
  execute: async ({ title, tasks }) => {
    return { title, tasks };
  },
});
export const showRecipe = tool({
  description:
    "You are a professional chef. Provide precise measurements and clear step-by-step instructions.",
  inputSchema: recipeSchema,
  execute: async (recipeData) => {
    console.log("Data of rec", recipeData);
    return recipeData;
  },
});

export const allTools = {
  showWeather,
  showTasks,
  showRecipe,
};
