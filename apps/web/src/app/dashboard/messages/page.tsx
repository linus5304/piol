'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { useState } from 'react';

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `Il y a ${diffMins} min`;
  }
  if (diffHours < 24) {
    return `Il y a ${diffHours}h`;
  }
  if (diffDays < 7) {
    return `Il y a ${diffDays}j`;
  }
  return new Date(timestamp).toLocaleDateString('fr-FR');
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = useQuery(api.messages.getConversations);

  // Filter conversations based on search query
  const filteredConversations = conversations?.filter((conv) => {
    const userName = `${conv.otherUser?.firstName || ''} ${conv.otherUser?.lastName || ''}`;
    const propertyTitle = conv.property?.title || '';
    const query = searchQuery.toLowerCase();
    return userName.toLowerCase().includes(query) || propertyTitle.toLowerCase().includes(query);
  });

  // Loading state
  if (conversations === undefined) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">Gérez vos conversations</p>
        </div>
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="bg-background rounded-lg border divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">Gérez vos conversations</p>
      </div>

      {/* Search */}
      <div>
        <Input
          type="search"
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Conversations List */}
      <div className="bg-background rounded-lg border divide-y">
        {!filteredConversations || filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-foreground mb-1">Aucune conversation</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Aucune conversation ne correspond à votre recherche'
                : 'Vos conversations apparaîtront ici'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Link
              key={conversation.conversationId}
              href={`/dashboard/messages/${encodeURIComponent(conversation.conversationId)}`}
              className={cn(
                'flex items-start gap-4 p-4 hover:bg-muted transition-colors',
                conversation.unreadCount > 0 && 'bg-primary/5'
              )}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {getInitials(conversation.otherUser?.firstName, conversation.otherUser?.lastName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {conversation.otherUser?.firstName || 'Utilisateur'}{' '}
                    {conversation.otherUser?.lastName || ''}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                {conversation.property && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.property.title}
                  </p>
                )}
                <p
                  className={cn(
                    'text-sm truncate mt-1',
                    conversation.unreadCount > 0
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {conversation.lastMessage.isFromMe && 'Vous: '}
                  {conversation.lastMessage.text}
                </p>
              </div>

              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(conversation.lastMessage.timestamp)}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
