// components/ChatWindow.tsx
"use client";

import { WorkspaceLoader } from "./WorkspaceLoader";
import { ChatHeader } from "./ChatHeader";
import { EmptyState } from "./EmptyState";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatWindow } from "@/hooks/useChatWindow";

// Update the interface to accept dynamic inputs from the Server Router
interface ChatWindowProps {
  chatId: string;
  initialMessages: any[];
}

export default function ChatWindow({
  chatId,
  initialMessages,
}: ChatWindowProps) {
  // Pass them cleanly into your custom state hook controller
  const chat = useChatWindow({ chatId, initialMessages });

  if (!chat.isHydrated) {
    return <WorkspaceLoader />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-zinc-100 via-white to-zinc-100 p-2 sm:p-4">
      <div className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl sm:rounded-[32px] border border-zinc-200 bg-white/80 shadow-[0_10px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <ChatHeader status={chat.status} />

        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
            {chat.messages.length === 0 && (
              <EmptyState setInput={chat.setInput} />
            )}

            <MessageList
              messages={chat.messages}
              status={chat.status}
              messagesEndRef={chat.messagesEndRef}
            />
          </div>
        </div>

        <ChatInput
          input={chat.input}
          setInput={chat.setInput}
          previewUrl={chat.previewUrl}
          status={chat.status}
          stop={chat.stop}
          handleSend={chat.handleSend}
          handleChange={chat.handleChange}
        />
      </div>
    </div>
  );
}
