// components/ChatWindow.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";
import { WeatherCard } from "./WeatherCard";

import { useChat } from "@ai-sdk/react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { FileUIPart } from "ai";
import { TaskCard } from "./TaskCard";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { messages, sendMessage, status } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, status]);

  async function handleSend() {
    if (!input.trim() && !selectedFile) return;

    let filePart: FileUIPart[] | undefined = undefined;

    if (selectedFile) {
      // Convert the File object to a Base64 Data URL
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      filePart = [
        {
          type: "file",
          mediaType: selectedFile.type,
          filename: selectedFile.name,
          url: base64String, // This is now a Data URL the backend can read
        },
      ];
    }
    setInput("");
    setSelectedFile(null);
    setPreviewUrl(null);

    await sendMessage({
      text: input,
      files: filePart,
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const preview = URL.createObjectURL(file);

    setPreviewUrl(preview);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-zinc-100 via-white to-zinc-100 p-4">
      <div className="relative flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-zinc-200 bg-white/80 shadow-[0_10px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        {/* Header */}
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {messages.length === 0 && (
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
                  {[
                    {
                      label: "🌤️ Check Weather in Tokyo",
                      prompt: "What is the weather like in Tokyo right now?",
                    },
                    {
                      label: "📋 Create Coding Checklist",
                      prompt:
                        "Create a checklist of 5 essential coding technologies",
                    },
                    { label: "Build login UI", prompt: "Build login UI" },
                    {
                      label: "React performance tips",
                      prompt: "React performance tips",
                    },
                  ].map((suggestion) => (
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
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={`max-w-[80%] space-y-4 rounded-[24px] border px-5 py-4 shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-md border-zinc-200 bg-black text-white"
                      : "rounded-bl-md border-zinc-200 bg-white"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    // =========================
                    // TEXT PART
                    // =========================
                    if (part.type === "text") {
                      return (
                        <div
                          key={index}
                          className={`prose max-w-none text-sm leading-7 ${
                            message.role === "user"
                              ? "prose-invert"
                              : "prose-zinc"
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code(props) {
                                const { children } = props;

                                return (
                                  <code
                                    className={`rounded-md px-1.5 py-1 text-[13px] ${
                                      message.role === "user"
                                        ? "bg-white/10 text-white"
                                        : "bg-zinc-100 text-zinc-800"
                                    }`}
                                  >
                                    {children}
                                  </code>
                                );
                              },

                              pre(props) {
                                return (
                                  <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
                                    {props.children}
                                  </pre>
                                );
                              },

                              h1(props) {
                                return (
                                  <h1 className="mb-4 text-2xl font-bold">
                                    {props.children}
                                  </h1>
                                );
                              },

                              h2(props) {
                                return (
                                  <h2 className="mb-3 mt-6 text-xl font-semibold">
                                    {props.children}
                                  </h2>
                                );
                              },

                              ul(props) {
                                return (
                                  <ul className="list-disc space-y-2 pl-5">
                                    {props.children}
                                  </ul>
                                );
                              },

                              ol(props) {
                                return (
                                  <ol className="list-decimal space-y-2 pl-5">
                                    {props.children}
                                  </ol>
                                );
                              },

                              p(props) {
                                return <p className="mb-3">{props.children}</p>;
                              },

                              strong(props) {
                                return (
                                  <strong className="font-semibold">
                                    {props.children}
                                  </strong>
                                );
                              },
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      );
                    }

                    // =========================
                    // WEATHER TOOL PART
                    // =========================
                    if (
                      part.type === "tool-showWeather" &&
                      part.state === "output-available"
                    ) {
                      return (
                        <WeatherCard
                          key={index}
                          city={part.output.city}
                          temperature={part.output.temperature}
                        />
                      );
                    }
                    if (
                      part.type === "tool-showTasks" &&
                      part.state === "output-available"
                    ) {
                      return (
                        <TaskCard
                          key={index}
                          title={part.output.title}
                          tasks={part.output.tasks}
                        />
                      );
                    }
                    if (part.type === "file") {
                      return (
                        <img
                          key={index}
                          src={part.url}
                          alt={part.filename ?? "uploaded image"}
                          className="max-w-sm rounded-2xl border border-zinc-200"
                        />
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            ))}

            {/* Skeleton While Waiting */}
            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-[24px] rounded-bl-md border border-zinc-200 bg-white px-5 py-4 shadow-sm">
                  <div className="flex w-64 flex-col gap-2 py-1">
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-[90%] animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-[65%] animate-pulse rounded bg-zinc-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-200 bg-white/80 px-5 py-5 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-3xl items-end gap-3">
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
                className="max-h-40 min-h-[56px] w-full resize-none rounded-3xl border border-zinc-200 bg-zinc-50 px-5 py-4 pr-14 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-100"
              />

              <div className="App">
                <h2>Add Image:</h2>
                <input type="file" onChange={handleChange} />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="mt-3 max-h-40 rounded-2xl border border-zinc-200 object-cover"
                  />
                )}
              </div>

              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                {status === "streaming" ? (
                  <button
                    onClick={stop}
                    className="flex h-10 items-center justify-center rounded-full bg-red-500 px-4 text-sm font-medium text-white transition-all hover:bg-red-600"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={status !== "ready" || !input.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <SendHorizonal size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-3 flex w-full max-w-3xl items-center justify-between px-1">
            <p className="text-xs text-zinc-400">Press Enter to send</p>

            <p className="text-xs text-zinc-400">
              Real-time AI streaming enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
