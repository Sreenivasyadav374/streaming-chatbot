"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Chat {
  id: string;
  title: string;
  updated_at: string;
}

export function SidebarChatList({ initialChats }: { initialChats: Chat[] }) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const params = useParams();
  const currentChatId = params?.id as string;

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
    <nav className="flex flex-col gap-1 overflow-y-auto max-h-[70vh] mt-2">
      {chats.map((chat) => {
        const isActive = currentChatId === chat.id;
        return (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={`truncate px-3 py-2.5 rounded-xl text-sm transition-colors block ${
              isActive
                ? "bg-zinc-900 text-zinc-100 font-medium"
                : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100"
            }`}
          >
            {chat.title}
          </Link>
        );
      })}
    </nav>
  );
}
