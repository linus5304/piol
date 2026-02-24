'use client';

import { NotificationPanel } from '@/components/notifications/notification-panel';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unreadCount = useQuery(api.notifications.getUnreadNotificationCount);

  useEffect(() => {
    document.title = unreadCount && unreadCount > 0 ? `(${unreadCount}) Piol` : 'Piol';
  }, [unreadCount]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          data-testid="notification-bell"
        >
          <Bell className="h-4 w-4" />
          {unreadCount != null && unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground"
              data-testid="notification-badge"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0" data-testid="notification-panel">
        <NotificationPanel onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
