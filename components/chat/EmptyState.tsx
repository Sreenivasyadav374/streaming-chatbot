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
    <div className="mt-24 flex flex-col items-center justify-center text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-black text-white shadow-xl">
        <Sparkles size={34} />
      </div>

      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Your AI Workspace
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
        Ask about frontend, React, UI, performance, or AI concepts.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => setInput(suggestion.prompt)}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-black"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
