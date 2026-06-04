// components/WorkspaceLoader.tsx
import { Loader as Loader2, Sparkles } from "lucide-react";

export function WorkspaceLoader() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 p-2 sm:p-4 overflow-hidden">
      {/* Subtle background tech grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Dynamic ambient glowing light behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-zinc-400/10 blur-[80px] pointer-events-none animate-pulse" />

      {/* Main Container Card */}
      <div className="relative flex h-full w-full max-w-4xl flex-col items-center justify-center rounded-2xl sm:rounded-[32px] border border-zinc-200/80 bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-500">
        <div className="flex flex-col items-center gap-6">
          {/* Enhanced Loader Container with a pulsing outer ring */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] ring-4 ring-zinc-100 animate-bounce">
            <Sparkles className="h-6 w-6 text-zinc-200 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border border-white/20" />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            {/* Spinning Indicator */}
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
              <p className="text-sm font-semibold tracking-tight text-zinc-800">
                Initializing Workspace
              </p>
            </div>

            {/* Subtle status subtitle */}
            <p className="text-xs text-zinc-400 font-medium tracking-wide animate-pulse uppercase">
              Loading generative UI layers...
            </p>
          </div>
        </div>

        {/* Minimalist bottom indicator */}
        <div className="absolute bottom-8 text-[11px] font-mono text-zinc-400/80 tracking-widest uppercase">
          Secure AI Sandbox v1.0
        </div>
      </div>
    </div>
  );
}
