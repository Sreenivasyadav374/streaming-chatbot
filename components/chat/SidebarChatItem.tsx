"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";

interface SidebarChatItemProps {
  chatId: string;
  title: string;
  isActive: boolean;
}

export function SidebarChatItem({
  chatId,
  title,
  isActive,
}: SidebarChatItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteChat = useChatStore((state) => state.deleteChat);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat thread? This cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      await deleteChat(chatId);
      if (isActive) {
        router.push("/");
      }

      router.refresh();
    } catch (err) {
      console.error("❌ Failed to purge chat thread workspace:", err);
      alert(
        "Could not sync deletion across tables. Connection timed out—restoring chat thread.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link
      href={`/chat/${chatId}`}
      className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        isActive
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      <span className="truncate max-w-[80%]">
        {title || "New Conversation"}
      </span>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`rounded-md p-1 transition-all hover:bg-zinc-200 hover:text-red-600 opacity-100 md:opacity-0 group-hover:opacity-100 ${
          isActive
            ? "hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
            : "text-zinc-400"
        } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Delete chat thread"
      >
        {isDeleting ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.34 6.14m-4.08 0L9.31 9m11.13-2.31c.85-.16 1.65-.7 1.65-1.58V4.11c0-.88-.8-1.42-1.65-1.58A48.11 48.11 0 0 0 3 4.11v.34c0 .88.8 1.42 1.65 1.58L5.38 21a2.25 2.25 0 0 0 2.25 2.25h8.25a2.25 2.25 0 0 0 2.25-2.25L19.31 6.69ZM9.37 3.75A1.5 1.5 0 0 1 10.8 2h2.4a1.5 1.5 0 0 1 1.41 1.75l-.15.9H9.52l-.15-.9Z"
            />
          </svg>
        )}
      </button>
    </Link>
  );
}
