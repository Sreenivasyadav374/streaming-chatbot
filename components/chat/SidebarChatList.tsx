"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { SidebarChatItem } from "./SidebarChatItem";
import { useChatStore, Chat } from "@/store/useChatStore";

export function SidebarChatList({ initialChats }: { initialChats: Chat[] }) {
  const params = useParams();
  const currentChatId = params?.chatId as string;

  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);

  useEffect(() => {
    if (initialChats) {
      setChats(initialChats);
    }
  }, [initialChats, setChats]);

  useEffect(() => {
    const handleOptimisticChat = (
      e: CustomEvent<{ id: string; title: string }>,
    ) => {
      const { id, title } = e.detail;

      const currentChats = useChatStore.getState().chats;

      if (currentChats.some((chat) => chat.id === id)) return;

      const placeholderChat: Chat = {
        id,
        title,
        user_id: "", // Fallback empty string if user_id isn't instantly available in layout context
      };

      setChats([placeholderChat, ...currentChats]);
    };

    window.addEventListener(
      "create-optimistic-chat" as any,
      handleOptimisticChat,
    );
    return () =>
      window.removeEventListener(
        "create-optimistic-chat" as any,
        handleOptimisticChat,
      );
  }, [setChats]);

  return (
    <nav className="flex flex-col space-y-1 px-2 py-4">
      <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Recent Conversations
      </div>

      {chats.map((chat) => (
        <SidebarChatItem
          key={chat.id}
          chatId={chat.id}
          title={chat.title}
          isActive={chat.id === currentChatId}
        />
      ))}

      {chats.length === 0 && (
        <div className="px-3 py-2 text-xs italic text-zinc-400">
          No active rooms found.
        </div>
      )}
    </nav>
  );
}
