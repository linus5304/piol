'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowLeft, Check, CheckCheck, Home, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface Message {
  _id: string;
  messageText: string;
  isFromMe: boolean;
  _creationTime: number;
  isRead?: boolean;
}

interface OtherUser {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

interface Property {
  _id: string;
  title: string;
  images?: string[];
}

interface MessageThreadProps {
  messages: Message[] | undefined;
  otherUser?: OtherUser | null;
  property?: Property | null;
  propertyId?: string;
  isLoading?: boolean;
  className?: string;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

function MessageThreadSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Property Card Skeleton */}
      <div className="py-4">
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 space-y-4 py-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-end' : 'justify-start')}>
            <Skeleton className="h-16 w-64 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageThreadEmpty() {
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia>
          <MessageCircle className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>Start the conversation by sending a message below</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={cn('flex', message.isFromMe ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2',
          message.isFromMe
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.messageText}</p>
        <div
          className={cn(
            'flex items-center justify-end gap-1 mt-1',
            message.isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          <span className="text-xs">{formatTime(message._creationTime)}</span>
          {message.isFromMe &&
            (message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}

interface ThreadHeaderProps {
  otherUser?: OtherUser | null;
  property?: Property | null;
  propertyId?: string;
}

function ThreadHeader({ otherUser, property, propertyId }: ThreadHeaderProps) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b">
      <Link href="/dashboard/messages">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </Link>
      <Avatar className="h-10 w-10">
        <AvatarImage src={otherUser?.imageUrl ?? undefined} />
        <AvatarFallback>{getInitials(otherUser?.firstName, otherUser?.lastName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {otherUser?.firstName || 'User'} {otherUser?.lastName || ''}
        </p>
        {property && <p className="text-sm text-muted-foreground truncate">{property.title}</p>}
      </div>
      {propertyId && (
        <Link href={`/properties/${propertyId}`}>
          <Button variant="outline" size="sm">
            View property
          </Button>
        </Link>
      )}
    </div>
  );
}

interface PropertyCardProps {
  property: Property;
}

function PropertyContextCard({ property }: PropertyCardProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-background border">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <Home className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{property.title}</p>
          <p className="text-sm text-muted-foreground">Conversation about this property</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function MessageThread({
  messages,
  otherUser,
  property,
  propertyId,
  isLoading,
  className,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const messagesLength = messages?.length ?? 0;
  useEffect(() => {
    if (messagesLength > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesLength]);

  if (isLoading || messages === undefined) {
    return <MessageThreadSkeleton />;
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <ThreadHeader otherUser={otherUser} property={property} propertyId={propertyId} />

      {property && (
        <div className="py-4">
          <PropertyContextCard property={property} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 py-4">
        {messages.length === 0 ? (
          <MessageThreadEmpty />
        ) : (
          messages.map((message) => <MessageBubble key={message._id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
