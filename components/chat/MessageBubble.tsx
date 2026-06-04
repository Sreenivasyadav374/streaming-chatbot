import { MessagePartRenderer } from "./MessagePartRenderer";

export function MessageBubble({ message }: any) {
  // OPTIMAL FALLBACK: If the SDK or DB yields flat 'content' instead of structured 'parts',
  // wrap the content string dynamically into a virtual text part format so your renderer functions perfectly!
  const structuralParts = message.parts || [
    {
      type: "text",
      text: message.content || "",
    },
  ];

  return (
    <div
      className={
        message.role === "user" ? "flex justify-end" : "flex justify-start"
      }
    >
      <div
        className={`max-w-[90%] sm:max-w-[80%] space-y-4 rounded-2xl sm:rounded-[24px] border px-3 sm:px-5 py-3 sm:py-4 shadow-sm min-w-0 overflow-hidden ${
          message.role === "user"
            ? "rounded-br-md border-zinc-200 bg-black text-white"
            : "rounded-bl-md border-zinc-200 bg-white"
        }`}
      >
        {structuralParts.map((part: any, index: number) => (
          <MessagePartRenderer key={index} part={part} role={message.role} />
        ))}
      </div>
    </div>
  );
}
