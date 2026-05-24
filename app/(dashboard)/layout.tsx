// app/(dashboard)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewChatButton } from "@/components/chat/NewChatButton"; // <-- Import here

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

          {/* REPLACE OLD LINK WITH THIS CLEAN NEW BUTTON INTERACTION */}
          <NewChatButton />

          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[70vh] mt-2">
            {chats?.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="truncate px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors block"
              >
                {chat.title}
              </Link>
            ))}
          </nav>
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
