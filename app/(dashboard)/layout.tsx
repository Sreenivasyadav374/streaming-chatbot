// app/(dashboard)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewChatButton } from "@/components/chat/NewChatButton";
import { SidebarChatList } from "@/components/chat/SidebarChatList"; // <-- Import here

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
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 font-sans">
      <aside className="w-64 border-r border-zinc-200 bg-zinc-950 p-4 flex flex-col justify-between text-white select-none">
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
      </aside>

      <main className="flex-1 relative flex flex-col overflow-hidden bg-zinc-50">
        {children}
      </main>
    </div>
  );
}
