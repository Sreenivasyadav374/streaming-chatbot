// app/(dashboard)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewChatButton } from "@/components/chat/NewChatButton";
import { SidebarChatList } from "@/components/chat/SidebarChatList"; // <-- Import here
import { SignOutButton } from "@/components/auth/SignOutButton";

// Break the static generation cache to ensure layout state revalidation works smoothly
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: chats } = await supabase
    .from("chats")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 font-sans">
      {/* Sidebar — hidden on mobile, visible on md+ */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-zinc-200 bg-zinc-950 p-4 flex-col justify-between text-white select-none">
        <div className="flex flex-col gap-4">
          <div className="px-2 py-1.5 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Workspace Chatbot
          </div>

          <NewChatButton />

          {/* INSTANT CLIENT SYNC MENU REPLACES OLD HARDCODED LOOP */}
          <SidebarChatList initialChats={chats || []} />
        </div>

        <div className="flex flex-col gap-1 border-t border-zinc-900 pt-3">
          <div className="truncate text-sm font-medium text-zinc-300">
            {user.email?.split("@")[0]}
          </div>
          <div className="truncate text-xs text-zinc-500">{user.email}</div>
        </div>
        <div className="border-t border-zinc-100 pt-4">
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile top bar — visible only on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-zinc-950 px-4 py-3 text-white">
        <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Workspace Chatbot
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 truncate max-w-[120px]">{user.email?.split("@")[0]}</span>
          <SignOutButton />
        </div>
      </div>

      <main className="flex-1 relative flex flex-col overflow-hidden bg-zinc-50 md:pt-0 pt-[52px] min-w-0">
        {children}
      </main>
    </div>
  );
}
