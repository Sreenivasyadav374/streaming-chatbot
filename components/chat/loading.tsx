// app/loading.tsx
import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-zinc-100 via-white to-zinc-100 p-4">
      <div className="relative flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-zinc-200 bg-white/80 shadow-[0_10px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-2xl bg-zinc-200" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 animate-pulse rounded bg-zinc-200" />
              <div className="h-2.5 w-24 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
          <div className="h-7 w-40 animate-pulse rounded-full bg-zinc-100" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
            <p className="text-xs font-medium text-zinc-400 animate-pulse">
              Loading workspace...
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-white/80 px-5 py-4">
          <div className="mx-auto h-11 w-full max-w-3xl animate-pulse rounded-2xl bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
