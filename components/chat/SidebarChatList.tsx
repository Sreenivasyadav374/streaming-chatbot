"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SidebarChatItem } from "./SidebarChatItem";

interface Chat {
  id: string;
  title: string;
  updated_at: string;
}

export function SidebarChatList({ initialChats }: { initialChats: Chat[] }) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const params = useParams();
  const currentChatId = params?.chatId as string;

  // Keep client state completely in sync when server components revalidate
  useEffect(() => {
    if (initialChats) {
      setChats(initialChats);
    }
  }, [initialChats]);

  // Intercept the global custom event to append the new chat row instantly
  useEffect(() => {
    const handleOptimisticChat = (
      e: CustomEvent<{ id: string; title: string }>,
    ) => {
      const { id, title } = e.detail;

      setChats((prev) => {
        // Prevent duplicate appends if it's already rendered
        if (prev.some((chat) => chat.id === id)) return prev;

        const placeholderChat: Chat = {
          id,
          title,
          updated_at: new Date().toISOString(),
        };
        return [placeholderChat, ...prev];
      });
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
  }, []);

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
