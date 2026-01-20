'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const conversationId = decodeURIComponent(id);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages and conversations for context
  const messagesData = useQuery(api.messages.getMessages, { conversationId });
  const conversations = useQuery(api.messages.getConversations);

  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessagesAsRead);

  // Find the current conversation to get other user and property info
  const currentConversation = conversations?.find((c) => c.conversationId === conversationId);
  const otherUser = currentConversation?.otherUser;
  const property = currentConversation?.property;

  // Extract property ID from conversation ID if it exists (format: {userId}_{userId}_{propertyId})
  const propertyIdFromConversation = conversationId.split('_')[2] as
    | Parameters<typeof sendMessage>[0]['propertyId']
    | undefined;

  // Mark messages as read when viewing
  const messages = messagesData?.messages;
  useEffect(() => {
    if (messages && messages.length > 0) {
      markAsRead({ conversationId }).catch(console.error);
    }
  }, [conversationId, messages, markAsRead]);

  // Scroll to bottom when new messages arrive
  const messagesLength = messages?.length ?? 0;
  useEffect(() => {
    if (messagesLength > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesLength]);

  const handleSend = async () => {
    if (!newMessage.trim() || !otherUser?._id) return;

    setIsSending(true);
    try {
      await sendMessage({
        recipientId: otherUser._id,
        propertyId: propertyIdFromConversation,
        messageText: newMessage.trim(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Loading state
  if (messagesData === undefined || conversations === undefined) {
    return (
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        {/* Property Preview Skeleton */}
        <div className="my-4 p-3 bg-muted rounded-lg border">
          <div className="flex items-center gap-3">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 space-y-4 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-end' : 'justify-start')}>
              <Skeleton className="h-16 w-64 rounded-2xl" />
            </div>
          ))}
        </div>

        {/* Input Skeleton */}
        <div className="pt-4 border-t">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  const displayMessages = messages || [];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Link href="/dashboard/messages" className="text-muted-foreground hover:text-foreground">
          ← Retour
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted">
              {getInitials(otherUser?.firstName, otherUser?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {otherUser?.firstName || 'Utilisateur'} {otherUser?.lastName || ''}
              </span>
            </div>
            {property && <p className="text-sm text-muted-foreground">{property.title}</p>}
          </div>
        </div>
        {propertyIdFromConversation && (
          <Link href={`/properties/${propertyIdFromConversation}`}>
            <Button variant="outline" size="sm">
              Voir la propriété
            </Button>
          </Link>
        )}
      </div>

      {/* Property Preview Card */}
      {property && (
        <div className="my-4 p-3 bg-muted rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-border rounded-lg flex items-center justify-center text-2xl">
              🏠
            </div>
            <div>
              <p className="font-medium text-foreground">{property.title}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {displayMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Aucun message. Commencez la conversation!</p>
          </div>
        ) : (
          displayMessages.map((message) => (
            <div
              key={message._id}
              className={cn('flex', message.isFromMe ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[70%] rounded-2xl px-4 py-2',
                  message.isFromMe
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p>{message.messageText}</p>
                <p
                  className={cn(
                    'text-xs mt-1',
                    message.isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}
                >
                  {formatTime(message._creationTime)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="pt-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={isSending}
          />
          <Button type="submit" disabled={!newMessage.trim() || isSending}>
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
