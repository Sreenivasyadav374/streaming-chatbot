import OpenAI from "openai";

// Use OpenRouter’s OpenAI‑compatible base URL
export const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export const CHAT_MODEL =
  "openrouter/auto"; // free model
// mistralai/mistral-7b-instruct:free  
// meta-llama/llama-3-8b-instruct:free  
// openchat/openchat-3.5-0106:free  
// nousresearch/nous-capybara-7b:free  
// gryphe/mythomax-l2-13b:free  
// 

