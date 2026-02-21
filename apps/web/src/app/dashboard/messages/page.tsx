'use client';

import { ConversationList } from '@/components/messaging';
import { PageHeader } from '@/components/ui/page-header';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';

export default function MessagesPage() {
  const conversations = useQuery(api.messages.getConversations);
  const t = useTranslations();

  const unreadCount = conversations?.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title={t('messages.title')} count={unreadCount} />

      <ConversationList conversations={conversations} />
    </div>
  );
}
