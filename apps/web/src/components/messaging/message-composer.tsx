'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useCallback, useRef, useState } from 'react';

const MAX_LENGTH = 2000;
const SHOW_COUNT_THRESHOLD = 1800;

interface MessageComposerProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MessageComposer({
  onSend,
  disabled,
  placeholder = 'Type a message...',
  className,
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = message.trim().length > 0 && !isSending && !disabled;
  const charCount = message.length;
  const showCharCount = charCount > SHOW_COUNT_THRESHOLD;
  const isNearLimit = charCount > MAX_LENGTH - 50;

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const maxHeight = 6 * 24; // ~4 lines
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, []);

  const handleSend = async () => {
    if (!canSend) return;

    const textToSend = message.trim();
    setMessage('');
    setIsSending(true);

    try {
      await onSend(textToSend);
    } catch (error) {
      setMessage(textToSend);
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('pt-4 border-t', className)}>
      <div className="flex items-end gap-2">
        <div className="flex-1 rounded-lg border bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTH) {
                setMessage(e.target.value);
                resizeTextarea();
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            rows={1}
            className="flex w-full resize-none bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Message input"
          />
        </div>
        <Button
          type="submit"
          size="icon-lg"
          disabled={!canSend}
          className={cn('shrink-0 rounded-lg', canSend && 'active:scale-95')}
          aria-label="Send message"
        >
          {isSending ? <Spinner className="size-4" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      {showCharCount && (
        <p
          className={cn(
            'text-xs text-right mt-1 pr-12',
            isNearLimit ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {charCount}/{MAX_LENGTH}
        </p>
      )}
    </form>
  );
}
