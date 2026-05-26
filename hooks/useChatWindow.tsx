// hooks/useChatWindow.ts
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage, FileUIPart } from "ai";
import { useRouter } from "next/navigation";
interface UseChatWindowProps {
  chatId: string;
  initialMessages: UIMessage[];
}

export function useChatWindow({ chatId, initialMessages }: UseChatWindowProps) {
  const [input, setInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isHydrated, setIsHydrated] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const router = useRouter();

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    id: chatId,
    messages: initialMessages,
    onFinish: () => {
      router.refresh();
      window.dispatchEvent(new Event("chat-title-updated"));
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate or wait for initial mount, then trigger zoom out/exit sequence
    const timer = setTimeout(() => {
      setIsExiting(true); // Start the zoom animation

      // Match this timeout exactly with your CSS transition duration (e.g., 600ms)
      const unmountTimer = setTimeout(() => {
        setIsHydrated(true); // Fully unmount loader and show chat
      }, 600);

      return () => clearTimeout(unmountTimer);
    }, 500); // Gives a brief moment to show initial state if loading is instant

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, status]);

  async function handleSend() {
    if (!input.trim() && !selectedFile) return;

    let filePart: FileUIPart[] | undefined = undefined;

    if (selectedFile) {
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
          url: base64String,
        },
      ];
    }

    const currentInput = input;
    setInput("");
    setSelectedFile(null);
    setPreviewUrl(null);

    await sendMessage(
      {
        text: currentInput,
        files: filePart,
      },
      {
        body: { chatId },
      },
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }

  return {
    input,
    setInput,
    previewUrl,
    isHydrated,
    isExiting,
    messages,
    status,
    stop,
    messagesEndRef,
    handleSend,
    handleChange,
  };
}
