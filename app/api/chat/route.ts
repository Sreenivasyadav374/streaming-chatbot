// app/api/chat/route.ts
import { streamText, convertToModelMessages,generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { allTools } from "./tools";
import { createClient } from "@/lib/supabase/server";

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
const model = googleProvider("gemini-2.5-flash");

// app/api/chat/route.ts

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { messages, chatId } = await req.json();

    if (!chatId) {
      return new Response("Missing chatId parameter", { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];

    // FIX: Extract the text string from 'content' or fallback to parsing the AI SDK 'parts' array
    let dbContentText = "";
    
    if (typeof latestMessage.content === "string" && latestMessage.content.trim() !== "") {
      dbContentText = latestMessage.content;
    } else if (Array.isArray(latestMessage.parts)) {
      // Find the text segment part inside the array collection layout
      const textPart = latestMessage.parts.find((p: any) => p.type === "text");
      dbContentText = textPart ? textPart.text : "";
    }

    // Now insert into the database with a guaranteed text string value
    const { error: userMsgError } = await supabase.from("messages").insert({
      chat_id: chatId,
      role: latestMessage.role,
      content: JSON.stringify(dbContentText) // Safely stringified to keep JSONB column parsing happy
    });

    if (userMsgError) {
      console.error("❌ Supabase user message insertion error:", userMsgError);
      return new Response(userMsgError.message, { status: 500 });
    }

    // Process streaming models downstream...
    const result = streamText({
      model: model,
      messages: await convertToModelMessages(messages),
      system: `You are an AI assistant...`,
      tools: {
        showWeather: allTools.showWeather,
        showTasks: allTools.showTasks,
        showRecipe: allTools.showRecipe,
      },
onFinish: async ({ text, toolCalls }) => {
        // 1. Save the assistant response
        await supabase.from("messages").insert({
          chat_id: chatId,
          role: "assistant",
          content: JSON.stringify(text || toolCalls)
        });

        // 2. DYNAMIC TITLE GENERATION
        // If this is the first message exchange, trigger an automatic title summary compilation
        if (messages.length === 1) {
          try {
            const { text: summaryTitle } = await generateText({
              model: model,
              prompt: `Analyze this initial user chat message: "${dbContentText}". Generate a concise, clean, descriptive chat title based on it. Max 4-5 words. Do not use quotation marks or prefixes like "Title:". Just return the pure title text.`,
            });

            // Update the record in the database
            await supabase
              .from("chats")
              .update({ title: summaryTitle.trim(), updated_at: new Date().toISOString() })
              .eq("id", chatId);
          } catch (titleErr) {
            console.error("⚠️ Background title generation failed:", titleErr);
          }
        } else {
          // If it's not the first message, just bump the updated_at timestamp to bring it to the top of the sidebar
          await supabase
            .from("chats")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", chatId);
        }
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}