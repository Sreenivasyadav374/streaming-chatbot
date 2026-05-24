// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Strategy A: Standard Password Authentication
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Middleware handles validation sync, force layout transition
      router.push("/");
      router.refresh();
    }
  };

  // Strategy B: Magic Link Authentication (Passwordless)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Automatically redirects user back to base platform dashboard upon clicking email verification link
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage(
        "Check your inbox! We sent you a secure magic authentication link.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 font-bold text-white text-lg select-none">
          AI
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950 mt-2">
          Welcome back
        </h1>
        <p className="text-xs text-zinc-500">
          Sign in to preserve your workspace streaming channels
        </p>
      </div>

      {/* Status Notifications */}
      {errorMsg && (
        <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 animate-in fade-in zoom-in-95 duration-200">
          {errorMsg}
        </div>
      )}
      {message && (
        <div className="rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700 border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
          {message}
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-700">
            Email address
          </label>
          <input
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-700">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors disabled:opacity-60"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-zinc-950 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:bg-zinc-400 active:scale-[0.99] transition-all"
          >
            {loading ? "Authenticating..." : "Sign In with Password"}
          </button>

          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading || !email}
            className="flex h-10 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
          >
            Send Magic Link Email
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center text-xs text-zinc-400 leading-normal">
        Don't have an account? Sign-ins automatically provision fresh profiles
        via the underlying database framework.
      </div>
    </div>
  );
}
