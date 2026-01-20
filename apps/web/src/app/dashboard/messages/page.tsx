'use client';

import { ConversationList } from '@/components/messaging';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';

export default function MessagesPage() {
  const conversations = useQuery(api.messages.getConversations);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">Manage your conversations</p>
      </div>

      <ConversationList conversations={conversations} />
    </div>
  );
}
