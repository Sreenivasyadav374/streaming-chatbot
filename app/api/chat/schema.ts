// app/api/recipe/schema.ts
import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
    }),
  ),
  instructions: z.array(z.string()),
});
export const taskSchema = z.object({
  title: z.string().describe("The name to create for the task list"),
  tasks: z
    .array(
      z.object({
        id: z.string().describe("Unique random string id"),
        text: z.string().describe("The task description"),
        completed: z.boolean().default(false).describe("Set false by default"),
      }),
    )
    .describe("The list of tasks"),
});

export const weatherSchema = z.object({
  location: z.string().describe("The city name to get weather for"),
});

export type RecipeData = z.infer<typeof recipeSchema>;
