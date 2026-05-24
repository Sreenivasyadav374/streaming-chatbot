// app/(dashboard)/chat/[chatId]/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatWindow from "@/components/chat/ChatWindow";

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. Fetch old history for this specific room ordered sequentially
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", params.chatId)
    .order("created_at", { ascending: true });

  // 2. Map database rows into valid AI SDK message parts objects
  const formattedMessages = (messages || []).map((msg) => {
    // Parse the stringified JSONB column content safely
    let contentString = "";
    try {
      contentString =
        typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
    } catch {
      contentString = msg.content;
    }

    return {
      id: msg.id,
      role: msg.role as "user" | "assistant",
      // If it's a user message, wrap it back in a compatible parts array format
      ...(msg.role === "user"
        ? { parts: [{ type: "text", text: contentString }] }
        : { content: contentString }),
    };
  });

  // 3. Pass everything down into your component layout
  return (
    <ChatWindow
      chatId={params.chatId}
      initialMessages={formattedMessages as any}
    />
  );
}
