import { Sparkles } from "lucide-react";

const suggestions = [
  {
    label: "🌤️ Check Weather in Tokyo",
    prompt: "What is the weather like in Tokyo right now?",
  },
  {
    label: "📋 Create Coding Checklist",
    prompt: "Create a checklist of 5 essential coding technologies",
  },
  {
    label: "🥘 Recipe for an omlette",
    prompt: "Create a recipe for an omlette",
  },
  {
    label: "🧑‍💻 React performance tips",
    prompt: "React performance tips",
  },
];

interface EmptyStateProps {
  setInput: (value: string) => void;
}

export function EmptyState({ setInput }: EmptyStateProps) {
  return (
    <div className="mt-10 sm:mt-24 flex flex-col items-center justify-center text-center px-2">
      <div className="mb-4 sm:mb-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-[20px] sm:rounded-[28px] bg-black text-white shadow-xl">
        <Sparkles size={28} className="sm:hidden" />
        <Sparkles size={34} className="hidden sm:block" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
        Your AI Workspace
      </h2>

      <p className="mt-2 sm:mt-3 max-w-md text-sm leading-6 text-zinc-500">
        Ask about frontend, React, UI, performance, or AI concepts.
      </p>

      <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-sm sm:max-w-none">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => setInput(suggestion.prompt)}
            className="rounded-full border border-zinc-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-black"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
