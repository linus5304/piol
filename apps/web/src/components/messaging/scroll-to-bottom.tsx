'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomProps {
  visible: boolean;
  unreadCount?: number;
  onClick: () => void;
}

export function ScrollToBottom({ visible, unreadCount, onClick }: ScrollToBottomProps) {
  return (
    <div
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-200',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        className="h-9 w-9 rounded-full shadow-md border"
        onClick={onClick}
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      {unreadCount && unreadCount > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
          {unreadCount}
        </span>
      ) : null}
    </div>
  );
}
