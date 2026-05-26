// app/api/chat/update-title/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { chatId, title } = await req.json();

    if (!chatId || !title) {
      return new Response("Missing parameters", { status: 400 });
    }

    // Update the title for this specific chat
    const { error } = await supabase
      .from("chats")
      .update({ title: title.trim() })
      .eq("id", chatId)
      .eq("user_id", user.id); // Security check

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Failed to update chat title:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}