import { Sparkles } from "lucide-react";

export function ChatHeader({ status }: { status: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
          <Sparkles size={18} />
        </div>

        <div>
          <h1 className="text-sm font-semibold text-zinc-900">
            Generative UI Assistant
          </h1>

          <p className="text-xs text-zinc-500">AI-powered streaming chat</p>
        </div>
      </div>

      <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500 shadow-sm">
        {status === "streaming" || status === "submitted"
          ? "Thinking..."
          : "Online"}
      </div>
    </div>
  );
}
