"use client";

import { useState, useRef, useEffect } from "react";
import { Message, ConnectionStatus as Status } from "@/types/chat";
import { Persona } from "@/types/persona";
import { DEFAULT_PERSONA } from "@/lib/personas";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import ConnectionStatus from "./ConnectionStatus";
import PersonaSelector from "./PersonaSelector";
import { MessageSquare } from "lucide-react";

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<Status>("connected");
  const [streamingContent, setStreamingContent] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<Persona>(DEFAULT_PERSONA);
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleAddCustomPersona = (personaData: Omit<Persona, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newPersona: Persona = {
      ...personaData,
      id: `custom-${Date.now()}`,
      user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCustomPersonas((prev) => [...prev, newPersona]);
    setSelectedPersona(newPersona);
  };

  const handleDeleteCustomPersona = (id: string) => {
    setCustomPersonas((prev) => prev.filter((p) => p.id !== id));
    if (selectedPersona.id === id) {
      setSelectedPersona(DEFAULT_PERSONA);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setConnectionStatus("streaming");
    setStreamingContent("");

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          systemPrompt: selectedPersona.system_prompt,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") continue;

            // Append text directly
            accumulatedContent += data;
            setStreamingContent(accumulatedContent);
          }
        }
      }

      if (accumulatedContent) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: accumulatedContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }

      setStreamingContent("");
      setConnectionStatus("connected");
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Error sending message:", error);
        setConnectionStatus("error");

        setTimeout(() => {
          setConnectionStatus("connected");
        }, 3000);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Chat Assistant</h1>
            <p className="text-xs text-muted-foreground">
              {selectedPersona.name} - Real-time streaming
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <PersonaSelector
            selectedPersona={selectedPersona}
            onSelectPersona={setSelectedPersona}
            customPersonas={customPersonas}
            onAddCustomPersona={handleAddCustomPersona}
            onDeleteCustomPersona={handleDeleteCustomPersona}
          />
          <ConnectionStatus status={connectionStatus} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Start a conversation
              </h2>
              <p className="text-muted-foreground max-w-md">
                Ask me anything! I&apos;ll respond with streaming answers in
                real-time.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isStreaming && streamingContent && (
            <div className="flex justify-start mb-4">
              <div className="flex flex-row items-end space-x-2 max-w-[80%] md:max-w-[70%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground mr-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-secondary text-secondary-foreground rounded-bl-none">
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {streamingContent}
                    <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          )}

          {isStreaming && !streamingContent && (
            <div className="flex justify-start mb-4">
              <div className="flex flex-row items-end space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground mr-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
    </div>
  );
}
