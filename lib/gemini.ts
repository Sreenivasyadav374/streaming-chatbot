import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

// ✅ USE THIS MODEL
export const GEMINI_MODEL = "gemini-1.0-pro";
