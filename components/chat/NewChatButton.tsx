"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Ensure this uses your client-side supabase instance

export function NewChatButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const supabase = createClient();

  const handleCreateChat = async () => {
    try {
      setIsCreating(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: newChat, error } = await supabase
        .from("chats")
        .insert([{ user_id: user.id, title: "New Chat Session" }])
        .select("id, title")
        .single();

      // CRITICAL: Stop execution if the server did not return a valid object record!
      if (error || !newChat?.id) {
        console.error("Failed to generate server room layout:", error);
        return;
      }

      window.dispatchEvent(
        new CustomEvent("create-optimistic-chat", {
          detail: { id: newChat.id, title: newChat.title },
        }),
      );

      // Only route if the ID is 100% verified present
      router.push(`/chat/${newChat.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreateChat}
      disabled={isCreating}
      className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50"
    >
      {isCreating ? "Creating..." : "＋ New Chat"}
    </button>
  );
}
