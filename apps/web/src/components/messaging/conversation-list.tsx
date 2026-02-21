'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { parseAppLocale } from '@/i18n/config';
import { formatDate } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { useLocale } from 'gt-next/client';
import { MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ConversationUser {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

interface ConversationProperty {
  _id: string;
  title: string;
}

interface Conversation {
  conversationId: string;
  otherUser?: ConversationUser | null;
  property?: ConversationProperty | null;
  lastMessage: {
    text: string;
    timestamp: number;
    isFromMe: boolean;
  };
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[] | undefined;
  className?: string;
}

function formatTimestamp(timestamp: number, locale: string): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m`;
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  if (diffDays < 7) {
    return `${diffDays}d`;
  }
  return formatDate(timestamp, locale, { month: 'short', day: 'numeric' });
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

function ConversationListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="rounded-lg border bg-card divide-y">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-3 w-8 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversationListEmpty({ hasSearch }: { hasSearch: boolean }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <MessageSquare className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>No conversations</EmptyTitle>
        <EmptyDescription>
          {hasSearch
            ? 'No conversations match your search'
            : 'Your conversations will appear here when you start messaging'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function ConversationList({ conversations, className }: ConversationListProps) {
  const locale = parseAppLocale(useLocale());
  const [searchQuery, setSearchQuery] = useState('');

  // Loading state
  if (conversations === undefined) {
    return <ConversationListSkeleton />;
  }

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const userName = `${conv.otherUser?.firstName || ''} ${conv.otherUser?.lastName || ''}`;
    const propertyTitle = conv.property?.title || '';
    const query = searchQuery.toLowerCase();
    return userName.toLowerCase().includes(query) || propertyTitle.toLowerCase().includes(query);
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Conversations */}
      {filteredConversations.length === 0 ? (
        <ConversationListEmpty hasSearch={searchQuery.trim().length > 0} />
      ) : (
        <div className="rounded-lg border bg-card divide-y">
          {filteredConversations.map((conversation) => {
            const isUnread = conversation.unreadCount > 0;

            return (
              <Link
                key={conversation.conversationId}
                href={`/dashboard/messages/${encodeURIComponent(conversation.conversationId)}`}
                className={cn(
                  'flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors',
                  isUnread && 'bg-success/5'
                )}
              >
                {/* Avatar */}
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={conversation.otherUser?.imageUrl ?? undefined} />
                  <AvatarFallback className="bg-muted">
                    {getInitials(
                      conversation.otherUser?.firstName,
                      conversation.otherUser?.lastName
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn('text-sm truncate', isUnread ? 'font-semibold' : 'font-medium')}
                    >
                      {conversation.otherUser?.firstName || 'User'}{' '}
                      {conversation.otherUser?.lastName || ''}
                    </span>
                  </div>
                  {conversation.property && (
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.property.title}
                    </p>
                  )}
                  <p
                    className={cn(
                      'text-sm text-muted-foreground truncate',
                      isUnread && 'font-semibold text-foreground'
                    )}
                  >
                    {conversation.lastMessage.isFromMe && 'You: '}
                    {conversation.lastMessage.text}
                  </p>
                </div>

                {/* Time & unread indicator */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(conversation.lastMessage.timestamp, locale)}
                  </span>
                  {isUnread && <span className="h-2 w-2 rounded-full bg-success" />}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
