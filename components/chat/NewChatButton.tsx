// components/NewChatButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NewChatButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChat = async () => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      // 1. Get current user session info
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // 2. Insert fresh row directly from browser client
      const { data: newChat, error } = await supabase
        .from("chats")
        .insert([{ user_id: user.id, title: "New Chat Session" }])
        .select()
        .single();

      if (error) throw error;

      if (newChat) {
        // 3. CRITICAL: Tell Next.js to purge stale layout cache records
        // This forces layout.tsx to refetch the sidebar links list!
        router.refresh();

        // 4. Move smoothly to the newly allocated destination segment matrix
        router.push(`/chat/${newChat.id}`);
      }
    } catch (err) {
      console.error("Failed to create session:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreateChat}
      disabled={isCreating}
      className="flex h-10 w-full items-center justify-center rounded-xl bg-white/10 text-sm font-medium hover:bg-white/15 active:scale-[0.98] disabled:opacity-50 transition-all text-white"
    >
      {isCreating ? "Initializing..." : "+ New Chat"}
    </button>
  );
}
