// app/(dashboard)/chat/[id]/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatWindow from "@/components/chat/ChatWindow"; // Your client-side message UI

export const dynamic = "force-dynamic";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  const supabase = await createClient();

  // 1. Verify user authentication status securely
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Security Check: Verify that this chat room actually belongs to the logged-in user
  const { data: chatRoom, error: roomError } = await supabase
    .from("chats")
    .select("id")
    .eq("id", chatId)
    .single();

  if (roomError || !chatRoom) {
    console.error("❌ RLS Security Blocked/Failed to find room:", {
      chatId,
      errorDetails: roomError?.message,
      foundRoom: !!chatRoom,
    });

    // Instead of bouncing back to "/" which creates a loop, redirect to a safe login or error boundary
    // Or simply return a clean UI message instead of a hard redirect loop!
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 text-zinc-500 p-8">
        <div className="text-center space-y-2">
          <p className="font-semibold text-zinc-800">
            Conversation Access Error
          </p>
          <p className="text-sm text-zinc-400">
            This conversation doesn't exist or you don't have permission to view
            it.
          </p>
        </div>
      </div>
    );
  }

  // 3. Fetch all existing historical messages for this specific chat ID
  const { data: dbMessages, error: messagesError } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("Error loading chat history matrix:", messagesError);
  }

  const initialMessages = (dbMessages || []).map((msg) => {
    let cleanContent = msg.content;

    if (typeof cleanContent === "string") {
      // 1. Trim whitespace to prevent formatting bugs
      cleanContent = cleanContent.trim();

      // 2. If it starts and ends with literal double quotes, unpack it
      if (cleanContent.startsWith('"') && cleanContent.endsWith('"')) {
        try {
          // This strips the outer escaped quotes: "\"Hello...\"" becomes "Hello..."
          cleanContent = JSON.parse(cleanContent);
        } catch {
          // Fallback in case parsing fails on a broken format block
          cleanContent = cleanContent.replace(/^"|"$/g, "");
        }
      }
    } else if (cleanContent !== null && typeof cleanContent === "object") {
      // Handle it cleanly if it ever returns as a parsed JSONB object structure
      cleanContent = JSON.stringify(cleanContent);
    }

    return {
      id: msg.id,
      role: msg.role as "user" | "assistant" | "system" | "data",
      content: String(cleanContent), // Force it into a completely flat string primitive
    };
  });

  return <ChatWindow chatId={chatId} initialMessages={initialMessages} />;
}
