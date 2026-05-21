import { useState, KeyboardEvent, FormEvent } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  onStop?: () => void;
  isStreaming?: boolean;
}

export default function ChatInput({
  onSend,
  disabled,
  onStop,
  isStreaming = false,
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-4">
      <div className="flex items-end space-x-2 max-w-4xl mx-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={disabled}
          className="min-h-[60px] max-h-[200px] resize-none"
          rows={1}
        />
        {isStreaming ? (
          <Button
            type="button"
            size="icon"
            onClick={onStop}
            variant="destructive"
            className="h-[60px] w-[60px] flex-shrink-0"
            title="Stop generation"
          >
            <Square className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !input.trim()}
            className="h-[60px] w-[60px] flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        )}
      </div>
    </form>
  );
}
