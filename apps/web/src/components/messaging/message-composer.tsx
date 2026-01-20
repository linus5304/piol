'use client';

import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { Loader2, Send } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useState } from 'react';

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

  const canSend = message.trim().length > 0 && !isSending && !disabled;

  const handleSend = async () => {
    if (!canSend) return;

    const textToSend = message.trim();
    setMessage('');
    setIsSending(true);

    try {
      await onSend(textToSend);
    } catch (error) {
      // Restore message on failure
      setMessage(textToSend);
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('pt-4 border-t', className)}>
      <InputGroup>
        <InputGroupInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          aria-label="Message input"
        />
        <InputGroupButton type="submit" disabled={!canSend} aria-label="Send message">
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </InputGroupButton>
      </InputGroup>
    </form>
  );
}
