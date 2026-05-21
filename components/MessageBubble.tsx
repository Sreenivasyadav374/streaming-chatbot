import { Message } from '@/types/chat';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';

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
            <div className="text-sm leading-relaxed markdown-content prose-sm max-w-none dark:prose-invert">
              {isUser ? (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  // rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0 break-words whitespace-pre-line">{children}</p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-3 mt-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-3 mt-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-bold mb-2 mt-2">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-xs font-bold mb-2 mt-2">{children}</h4>
                    ),
                    hr: () => <hr className="my-3 border-t border-current opacity-30" />,
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="break-words">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => (
                      <code className="bg-opacity-20 px-1 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-opacity-20 p-3 rounded mb-2 overflow-x-auto text-xs">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 pl-3 italic opacity-75 mb-2 my-2">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse border border-current border-opacity-30 text-xs">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-opacity-20 font-bold">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody>
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-current border-opacity-20">
                        {children}
                      </tr>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 border-r border-current border-opacity-20 last:border-r-0">
                        {children}
                      </td>
                    ),
                    th: ({ children }) => (
                      <th className="px-3 py-2 border-r border-current border-opacity-30 last:border-r-0 text-left font-bold">
                        {children}
                      </th>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
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
