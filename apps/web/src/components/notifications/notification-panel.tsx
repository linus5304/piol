'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/i18n-format';
import { api } from '@repo/convex/_generated/api';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { useLocale, useTranslations } from 'gt-next';
import {
  Bell,
  CheckCheck,
  CreditCard,
  FileCheck,
  Home,
  Loader2,
  MessageSquare,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  new_message: MessageSquare,
  payment_received: CreditCard,
  payment_sent: CreditCard,
  property_verified: FileCheck,
  property_rejected: ShieldCheck,
  new_application: FileCheck,
  application_approved: CheckCheck,
  application_rejected: ShieldCheck,
  new_listing: Home,
};

function formatTimestamp(timestamp: number, locale: string): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return formatDate(timestamp, locale, { month: 'short', day: 'numeric' });
}

function getDateGroup(timestamp: number): 'today' | 'yesterday' | 'older' {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  if (timestamp >= today.getTime()) return 'today';
  if (timestamp >= yesterday.getTime()) return 'yesterday';
  return 'older';
}

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { results, status, loadMore } = usePaginatedQuery(
    api.notifications.getNotifications,
    {},
    { initialNumItems: 10 }
  );
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const isLoading = status === 'LoadingFirstPage';
  const hasUnread = results.some((n) => !n.isRead);

  const handleClickNotification = async (notification: (typeof results)[0]) => {
    if (!notification.isRead) {
      await markAsRead({ notificationId: notification._id });
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      onClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.success(t('notifications.allMarkedRead'));
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: (typeof results)[0]['_id']) => {
    e.stopPropagation();
    await deleteNotification({ notificationId });
  };

  // Group notifications by date
  const groupedNotifications: {
    group: 'today' | 'yesterday' | 'older';
    items: typeof results;
  }[] = [];
  let currentGroup: 'today' | 'yesterday' | 'older' | null = null;

  for (const notification of results) {
    const group = getDateGroup(notification._creationTime);
    if (group !== currentGroup) {
      currentGroup = group;
      groupedNotifications.push({ group, items: [] });
    }
    groupedNotifications[groupedNotifications.length - 1].items.push(notification);
  }

  const groupLabels: Record<string, string> = {
    today: t('notifications.today'),
    yesterday: t('notifications.yesterday'),
    older: t('notifications.older'),
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{t('notifications.title')}</h3>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleMarkAllAsRead}
          >
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      <ScrollArea className="h-[min(24rem,calc(100vh-8rem))]">
        {isLoading ? (
          <div className="space-y-1 p-2">
            {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((id) => (
              <div key={id} className="flex items-start gap-3 p-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">{t('notifications.empty')}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {t('notifications.emptyDescription')}
            </p>
          </div>
        ) : (
          <div>
            {groupedNotifications.map(({ group, items }) => (
              <div key={group}>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider px-3 py-1.5">
                  {groupLabels[group]}
                </div>
                <div className="divide-y">
                  {items.map((notification) => {
                    const Icon = NOTIFICATION_ICONS[notification.notificationType] || Bell;
                    return (
                      <button
                        key={notification._id}
                        type="button"
                        className={`group flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50 ${
                          !notification.isRead ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleClickNotification(notification)}
                        data-testid="notification-item"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            notification.isRead ? 'bg-muted' : 'bg-primary/10'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              notification.isRead ? 'text-muted-foreground' : 'text-primary'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-tight ${
                              notification.isRead
                                ? 'text-muted-foreground'
                                : 'text-foreground font-semibold'
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <span className="text-[11px] text-muted-foreground group-hover:hidden">
                            {formatTimestamp(notification._creationTime, locale)}
                          </span>
                          {!notification.isRead && (
                            <span className="h-2.5 w-2.5 rounded-full bg-primary group-hover:hidden" />
                          )}
                          <button
                            type="button"
                            className="hidden group-hover:flex p-1 rounded-sm hover:bg-muted"
                            onClick={(e) => handleDelete(e, notification._id)}
                            aria-label={t('notifications.dismiss')}
                          >
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {status === 'CanLoadMore' && (
              <div className="flex justify-center py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-3 py-1.5 text-xs text-muted-foreground"
                  onClick={() => loadMore(10)}
                >
                  {t('notifications.loadMore')}
                </Button>
              </div>
            )}
            {status === 'LoadingMore' && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
