// app/api/chat/route.ts
import { streamText, convertToModelMessages, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { allTools } from "./tools";
import { createClient } from "@/lib/supabase/server";
import { waitUntil } from "@vercel/functions";

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
const model = googleProvider("gemini-2.5-flash");

// app/api/chat/route.ts

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { messages, chatId } = await req.json();

    if (!chatId) {
      return new Response("Missing chatId parameter", { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];

    // FIX: Extract the text string from 'content' or fallback to parsing the AI SDK 'parts' array
    let dbContentText = "";

    if (
      typeof latestMessage.content === "string" &&
      latestMessage.content.trim() !== ""
    ) {
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
      content: JSON.stringify(dbContentText), // Safely stringified to keep JSONB column parsing happy
    });

    if (userMsgError) {
      console.error("❌ Supabase user message insertion error:", userMsgError);
      return new Response(userMsgError.message, { status: 500 });
    }

    // MOVE TITLE GENERATION HERE (Before the stream configuration)
    if (messages.length === 1) {
      try {
        console.log("Generating title synchronously before streaming...");
        const { text: summaryTitle } = await generateText({
          model: model,
          prompt: `Analyze this initial user chat message: "${dbContentText}". Generate a concise, clean, descriptive chat title based on it. Max 4-5 words. Do not use quotation marks.`,
        });

        // Wait for the title write to finish completely
        await supabase
          .from("chats")
          .update({
            title: summaryTitle.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", chatId);

        console.log("✅ Title baked into DB before stream started!");
      } catch (titleErr) {
        console.error("⚠️ Pre-stream title generation failed:", titleErr);
      }
    }

    // Now kick off your standard streaming layout response safely
    const result = streamText({
      model: model,
      messages: await convertToModelMessages(messages),
      system: `You are an AI assistant...`,
      tools: {
        showWeather: allTools.showWeather,
        showTasks: allTools.showTasks,
        showRecipe: allTools.showRecipe,
      },
      onFinish: ({ text, toolCalls }) => {
        waitUntil(
          (async () => {
            // Just save the assistant message here
            await supabase.from("messages").insert({
              chat_id: chatId,
              role: "assistant",
              content: JSON.stringify(text || toolCalls),
            });

            // If it's not message 1, just bump timestamp normally
            if (messages.length > 1) {
              await supabase
                .from("chats")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", chatId);
            }
          })(),
        );
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
