import { create } from "zustand";
import { createClient } from "@/lib/supabase/client"; // Ensure you import your client-side Supabase initializer

export interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at?: string;
}

interface ChatState {
  chats: Chat[];
  isLoading: boolean;
  setChats: (chats: Chat[]) => void;
  deleteChat: (chatId: string) => Promise<void>;
}

// Initialize the client-side Supabase wrapper
const supabase = createClient();

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  isLoading: false,

  setChats: (chats) => {
    set({ chats });
  },

  deleteChat: async (chatId) => {
    // 1. Snapshot the current state before making any changes (for backup)
    const previousChats = get().chats;

    // 2. 🚀 OPTIMISTIC UPDATE: Instantly slice the chat out of client memory
    set({
      chats: previousChats.filter((chat) => chat.id !== chatId),
    });

    try {
      // throw new Error("Simulated Network Drop");
      // 3. Trigger the network deletion query to Supabase in the background
      const { error } = await supabase.from("chats").delete().eq("id", chatId);

      if (error) throw error;

      console.log(
        `✅ Successfully synced deletion for chat ${chatId} with Supabase.`,
      );
    } catch (err) {
      console.error(
        "❌ Background deletion failed! Initiating state rollback:",
        err,
      );

      // 4. 🔄 ROLLBACK MECHANISM: Snap back to the previous snapshot if server fails
      set({ chats: previousChats });

      // Throw the error forward so the UI layer can display a toast notification or alert if needed
      throw err;
    }
  },
}));
