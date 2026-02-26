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
import { parseAppLocale } from '@/i18n/config';
import { formatDate, formatTime } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { ArrowLeft, Check, CheckCheck, Home, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollToBottom } from './scroll-to-bottom';

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
  showBackButton?: boolean;
  className?: string;
}

function formatMessageTime(timestamp: number, locale: string): string {
  return formatTime(timestamp, locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

function getDateLabel(
  timestamp: number,
  locale: string,
  t: ReturnType<typeof useTranslations>
): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return t('messages.today');
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return t('messages.yesterday');
  }
  return formatDate(timestamp, locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function isSameDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return da.toDateString() === db.toDateString();
}

function MessageThreadSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="py-4">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
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
  const t = useTranslations();
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia>
          <MessageCircle className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>{t('messages.noMessages')}</EmptyTitle>
        <EmptyDescription>{t('messages.startConversation')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

interface MessageBubbleProps {
  message: Message;
  locale: string;
  isGrouped: boolean;
}

function MessageBubble({ message, locale, isGrouped }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex',
        message.isFromMe ? 'justify-end' : 'justify-start',
        isGrouped ? 'mt-0.5' : 'mt-3'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
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
          <span className="text-xs">{formatMessageTime(message._creationTime, locale)}</span>
          {message.isFromMe &&
            (message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground font-medium px-2">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

interface ThreadHeaderProps {
  otherUser?: OtherUser | null;
  property?: Property | null;
  propertyId?: string;
  showBackButton?: boolean;
}

function ThreadHeader({
  otherUser,
  property,
  propertyId,
  showBackButton = true,
}: ThreadHeaderProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-3 pb-4 border-b">
      {showBackButton && (
        <div className="md:hidden">
          <Link href="/dashboard/messages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('common.back')}
            </Button>
          </Link>
        </div>
      )}
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
        <>
          <Link href={`/properties/${propertyId}`} className="hidden sm:inline-flex">
            <Button variant="outline" size="sm">
              {t('messages.viewProperty')}
            </Button>
          </Link>
          <Link href={`/properties/${propertyId}`} className="sm:hidden">
            <Button variant="outline" size="icon-sm">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

interface PropertyCardProps {
  property: Property;
}

function PropertyContextCard({ property }: PropertyCardProps) {
  const t = useTranslations();
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background border overflow-hidden">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Home className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{property.title}</p>
          <p className="text-xs text-muted-foreground">{t('messages.aboutProperty')}</p>
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
  showBackButton = true,
  className,
}: MessageThreadProps) {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setNewMessageCount(0);
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const nearBottom = distanceFromBottom < 100;
    isNearBottomRef.current = nearBottom;
    setShowScrollButton(!nearBottom);
    if (nearBottom) {
      setNewMessageCount(0);
    }
  }, []);

  const messagesLength = messages?.length ?? 0;
  useEffect(() => {
    if (messagesLength > 0) {
      if (isNearBottomRef.current) {
        scrollToBottom('smooth');
      } else {
        setNewMessageCount((prev) => prev + 1);
      }
    }
  }, [messagesLength, scrollToBottom]);

  // Initial scroll to bottom
  const wasLoading = useRef(true);
  useEffect(() => {
    if (wasLoading.current && messages && messages.length > 0) {
      wasLoading.current = false;
      scrollToBottom('instant');
    }
  }, [messages, scrollToBottom]);

  if (isLoading || messages === undefined) {
    return <MessageThreadSkeleton />;
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <ThreadHeader
        otherUser={otherUser}
        property={property}
        propertyId={propertyId}
        showBackButton={showBackButton}
      />

      {property && (
        <div className="py-3">
          <PropertyContextCard property={property} />
        </div>
      )}

      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto py-4 px-1"
        >
          {messages.length === 0 ? (
            <MessageThreadEmpty />
          ) : (
            messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showDateSep =
                !prevMessage || !isSameDay(prevMessage._creationTime, message._creationTime);
              const isGrouped =
                !showDateSep && prevMessage !== null && prevMessage.isFromMe === message.isFromMe;

              return (
                <div key={message._id}>
                  {showDateSep && (
                    <DateSeparator label={getDateLabel(message._creationTime, locale, t)} />
                  )}
                  <MessageBubble message={message} locale={locale} isGrouped={isGrouped} />
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <ScrollToBottom
          visible={showScrollButton}
          unreadCount={newMessageCount}
          onClick={() => scrollToBottom('smooth')}
        />
      </div>
    </div>
  );
}
