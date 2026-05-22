import { MessageBubble } from "./MessageBubble";
import TypingIndicator from "../TypingIndicator";

export function MessageList({ messages, status, messagesEndRef }: any) {
  return (
    <>
      {messages.map((message: any) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {status === "submitted" && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </>
  );
}
