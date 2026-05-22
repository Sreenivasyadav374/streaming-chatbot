import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  previewUrl: string | null;
  status: string;
  stop: () => void;
  handleSend: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ChatInput({
  input,
  setInput,
  previewUrl,
  status,
  stop,
  handleSend,
  handleChange,
}: ChatInputProps) {
  return (
    <div className="border-t border-zinc-200 bg-white/80 px-5 py-3 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
        {/* Upload + Preview */}
        <div className="flex items-center gap-2">
          <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-black">
            <span className="text-xl font-medium">+</span>

            <input type="file" onChange={handleChange} className="hidden" />
          </label>

          {previewUrl && (
            <div className="relative h-10 w-10 shrink-0">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full rounded-xl border border-zinc-200 object-cover"
              />
            </div>
          )}
        </div>

        {/* Textarea */}
        <div className="relative flex-1">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== "ready"}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask something..."
            className="max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-12 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-100"
          />

          {/* Actions */}
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2">
            {status === "streaming" ? (
              <button
                onClick={stop}
                className="flex h-8 items-center justify-center rounded-full bg-red-500 px-3 text-xs font-medium text-white transition-all hover:bg-red-600"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={status !== "ready" || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SendHorizonal size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto mt-2 flex w-full max-w-3xl items-center justify-between px-1">
        <p className="text-[11px] text-zinc-400">Press Enter to send</p>

        <p className="text-[11px] text-zinc-400">
          Real-time AI streaming enabled
        </p>
      </div>
    </div>
  );
}
