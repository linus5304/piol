'use client';

import { ConversationList, MessageComposer, MessageThread } from '@/components/messaging';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { PageHeader } from '@/components/ui/page-header';
import { api } from '@repo/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

function DesktopEmptyState() {
  const t = useTranslations();
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia>
          <MessageSquare className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>{t('messages.selectConversation')}</EmptyTitle>
        <EmptyDescription>{t('messages.selectConversationDescription')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function DesktopThread({ conversationId }: { conversationId: string }) {
  const messagesData = useQuery(api.messages.getMessages, { conversationId });
  const conversations = useQuery(api.messages.getConversations);
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessagesAsRead);

  const currentConversation = conversations?.find(
    (c: { conversationId: string }) => c.conversationId === conversationId
  );
  const otherUser = currentConversation?.otherUser;
  const property = currentConversation?.property;
  const propertyIdFromConversation = conversationId.split('_')[2] as
    | Parameters<typeof sendMessage>[0]['propertyId']
    | undefined;

  const messages = messagesData?.messages;
  useEffect(() => {
    if (messages && messages.length > 0) {
      markAsRead({ conversationId }).catch(console.error);
    }
  }, [conversationId, messages, markAsRead]);

  const handleSendMessage = async (messageText: string) => {
    if (!otherUser?._id) {
      throw new Error('Cannot send message: recipient not found');
    }
    await sendMessage({
      recipientId: otherUser._id,
      propertyId: propertyIdFromConversation,
      messageText,
    });
  };

  const isLoading = messagesData === undefined || conversations === undefined;

  return (
    <div className="flex flex-col h-full">
      <MessageThread
        messages={messages}
        otherUser={otherUser}
        property={property}
        propertyId={propertyIdFromConversation}
        isLoading={isLoading}
        showBackButton={false}
        className="flex-1 min-h-0"
      />
      <MessageComposer onSend={handleSendMessage} disabled={!otherUser?._id} />
    </div>
  );
}

export default function MessagesPage() {
  const conversations = useQuery(api.messages.getConversations);
  const t = useTranslations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const unreadCount = conversations?.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title={t('messages.title')} count={unreadCount} />

      {/* Mobile: conversation list only (threads open as separate page) */}
      <div className="md:hidden">
        <ConversationList conversations={conversations} />
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden md:flex h-[calc(100vh-14rem)] gap-4">
        <div className="w-80 shrink-0 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId ?? undefined}
            onSelect={setSelectedId}
          />
        </div>
        <div className="flex-1 rounded-lg border bg-card p-4">
          {selectedId ? <DesktopThread conversationId={selectedId} /> : <DesktopEmptyState />}
        </div>
      </div>
    </div>
  );
}
