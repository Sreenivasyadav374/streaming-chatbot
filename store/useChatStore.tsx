import { create } from "zustand";

// 1. Define the core Chat object shape matching your Supabase schema
export interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at?: string;
}

// 2. Define the TypeScript interface for your global store state and actions
interface ChatState {
  chats: Chat[];
  isLoading: boolean;

  // Synchronizes server-fetched data into local memory on initial load
  setChats: (chats: Chat[]) => void;

  // Placeholder stub for the optimistic deletion mutation background loop
  deleteChat: (chatId: string) => Promise<void>;
}

// 3. Initialize the global store hook with empty stub actions
export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  isLoading: false,

  setChats: (chats) => {
    console.log("📥 Hydrating Zustand store with initial server chats:", chats);
    set({ chats });
  },

  deleteChat: async (chatId) => {
    console.log(
      "🚀 Stub action: Intending to optimistically delete chat ID:",
      chatId,
    );
    // This action is currently stubbed out for Sub-Task 1.
    // It will be fully implemented with error-handling rollbacks in Sub-Task 3.
    return Promise.resolve();
  },
}));
