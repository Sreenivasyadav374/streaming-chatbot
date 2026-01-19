import { Message } from '@/types/chat';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const formattedTime = format(new Date(message.timestamp), 'HH:mm');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-[80%] md:max-w-[70%]`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-primary text-primary-foreground ml-2'
              : 'bg-secondary text-secondary-foreground mr-2'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-br-none'
                : 'bg-secondary text-secondary-foreground rounded-bl-none'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          </div>
          <span
            className={`text-xs text-muted-foreground mt-1 px-2 ${
              isUser ? 'text-right' : 'text-left'
            }`}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
}
