"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Replace with your exact client-side helper path

export function SignOutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);

      // AC #1: Call supabase.auth.signOut() to clear session tokens and storage
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // AC #2: Push to /login and refresh the router to drop local layout caches
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("❌ Sign out integration failure:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoggingOut}
      className="flex items-center gap-1.5 sm:gap-3 rounded-xl px-2 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 sm:w-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4 sm:h-5 sm:w-5 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
        />
      </svg>
      <span className="hidden sm:inline">{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
