import { Sparkles } from "lucide-react";

export function ChatHeader({ status }: { status: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 px-4 sm:px-6 py-3 sm:py-4 min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-black text-white shadow-lg">
          <Sparkles size={16} className="sm:hidden" />
          <Sparkles size={18} className="hidden sm:block" />
        </div>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-zinc-900 truncate">
            Generative UI Assistant
          </h1>

          <p className="text-xs text-zinc-500 hidden sm:block">AI-powered streaming chat</p>
        </div>
      </div>

      <div className="shrink-0 rounded-full border border-zinc-200 bg-white px-2.5 sm:px-3 py-1 text-xs text-zinc-500 shadow-sm ml-2">
        {status === "streaming" || status === "submitted"
          ? "Thinking..."
          : "Online"}
      </div>
    </div>
  );
}
