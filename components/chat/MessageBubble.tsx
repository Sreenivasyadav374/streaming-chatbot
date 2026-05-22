import { MessagePartRenderer } from "./MessagePartRenderer";

export function MessageBubble({ message }: any) {
  return (
    <div
      className={
        message.role === "user" ? "flex justify-end" : "flex justify-start"
      }
    >
      <div
        className={`max-w-[80%] space-y-4 rounded-[24px] border px-5 py-4 shadow-sm ${
          message.role === "user"
            ? "rounded-br-md border-zinc-200 bg-black text-white"
            : "rounded-bl-md border-zinc-200 bg-white"
        }`}
      >
        {message.parts.map((part: any, index: number) => (
          <MessagePartRenderer key={index} part={part} role={message.role} />
        ))}
      </div>
    </div>
  );
}
