'use client';

import { MessageComposer, MessageThread } from '@/components/messaging';
import { api } from '@repo/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { use, useEffect } from 'react';

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const conversationId = decodeURIComponent(id);

  // Fetch messages and conversations for context
  const messagesData = useQuery(api.messages.getMessages, { conversationId });
  const conversations = useQuery(api.messages.getConversations);

  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessagesAsRead);

  // Find the current conversation to get other user and property info
  const currentConversation = conversations?.find(
    (c: { conversationId: string }) => c.conversationId === conversationId
  );
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
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <MessageThread
        messages={messages}
        otherUser={otherUser}
        property={property}
        propertyId={propertyIdFromConversation}
        isLoading={isLoading}
        className="flex-1 min-h-0"
      />

      <MessageComposer
        onSend={handleSendMessage}
        disabled={!otherUser?._id}
        placeholder="Type a message..."
      />
    </div>
  );
}
