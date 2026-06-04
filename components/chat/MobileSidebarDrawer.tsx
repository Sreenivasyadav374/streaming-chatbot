"use client";

import { useState, useEffect } from "react";
import { NewChatButton } from "./NewChatButton";
import { SidebarChatList } from "./SidebarChatList";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Chat } from "@/store/useChatStore";

interface MobileSidebarDrawerProps {
  initialChats: Chat[];
  userEmail: string;
  userDisplayName: string;
}

export function MobileSidebarDrawer({
  initialChats,
  userEmail,
  userDisplayName,
}: MobileSidebarDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer when a chat item is selected on mobile
  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener("close-mobile-drawer", handleClose);
    return () => window.removeEventListener("close-mobile-drawer", handleClose);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-zinc-950 px-4 py-3 text-white">
        {/* Hamburger button */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="flex items-center justify-center h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.75}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Workspace Chatbot
        </span>

        <span className="text-xs text-zinc-400 truncate max-w-[120px]">
          {userDisplayName}
        </span>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-zinc-950 text-white flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation sidebar"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Workspace Chatbot
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable chat list */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="mb-3">
            <NewChatButton />
          </div>
          <SidebarChatList initialChats={initialChats} />
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 p-4 space-y-1">
          <div className="truncate text-sm font-medium text-zinc-300">
            {userDisplayName}
          </div>
          <div className="truncate text-xs text-zinc-500">{userEmail}</div>
          <div className="pt-2 border-t border-zinc-900">
            <SignOutButton />
          </div>
        </div>
      </div>
    </>
  );
}
