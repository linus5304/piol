'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
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

function formatTimestamp(timestamp: number): string {
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
  return new Date(timestamp).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
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
      <ItemGroup className="rounded-lg border">
        {[1, 2, 3].map((i) => (
          <Item key={i}>
            <ItemMedia>
              <Skeleton className="h-10 w-10 rounded-full" />
            </ItemMedia>
            <ItemContent>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48 mt-1" />
            </ItemContent>
            <ItemActions>
              <Skeleton className="h-3 w-8" />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
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
        <ItemGroup className="rounded-lg border bg-background">
          {filteredConversations.map((conversation) => (
            <Link
              key={conversation.conversationId}
              href={`/dashboard/messages/${encodeURIComponent(conversation.conversationId)}`}
            >
              <Item
                className={cn('cursor-pointer', conversation.unreadCount > 0 && 'bg-primary/5')}
              >
                <ItemMedia>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.otherUser?.imageUrl ?? undefined} />
                    <AvatarFallback>
                      {getInitials(
                        conversation.otherUser?.firstName,
                        conversation.otherUser?.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="flex items-center gap-2">
                    <span>
                      {conversation.otherUser?.firstName || 'User'}{' '}
                      {conversation.otherUser?.lastName || ''}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </ItemTitle>
                  {conversation.property && (
                    <ItemDescription className="text-xs">
                      {conversation.property.title}
                    </ItemDescription>
                  )}
                  <ItemDescription
                    className={cn(conversation.unreadCount > 0 && 'text-foreground font-medium')}
                  >
                    {conversation.lastMessage.isFromMe && 'You: '}
                    {conversation.lastMessage.text}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(conversation.lastMessage.timestamp)}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="h-5 min-w-5 justify-center px-1.5">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </ItemActions>
              </Item>
            </Link>
          ))}
        </ItemGroup>
      )}
    </div>
  );
}
