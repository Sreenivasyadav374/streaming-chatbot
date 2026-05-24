// app/(dashboard)/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: newChat } = await supabase
    .from("chats")
    .insert([{ user_id: user.id, title: "New Chat Session" }])
    .select()
    .single();

  if (newChat) {
    redirect(`/chat/${newChat.id}`);
  }

  return (
    <div className="p-8 text-zinc-500">Initializing conversation module...</div>
  );
}
