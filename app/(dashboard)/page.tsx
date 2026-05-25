// app/(dashboard)/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: newChat, error } = await supabase
    .from("chats")
    .insert([{ user_id: user.id, title: "New Chat Session" }])
    .select("id") // Explicitly demand just the ID string back
    .single();

  if (error || !newChat?.id) {
    console.error("❌ Failed to initialize fresh database row profile:", error);

    // Fallback: Render a safe client-action state instead of redirecting to a broken string
    return (
      <div className="p-8 text-red-500 font-medium">
        Database generation pipeline stalled. Please verify table connections.
      </div>
    );
  }

  // Double-verify that the variable is a valid string before executing
  if (newChat && newChat.id) {
    redirect(`/chat/${newChat.id}`);
  }

  return (
    <div className="p-8 text-zinc-500">Initializing conversation module...</div>
  );
}
