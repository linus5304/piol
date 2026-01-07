'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

// Mock data for messages
const mockConversations = [
  {
    id: '1',
    user: {
      name: 'Jean Kamga',
      avatar: null,
      verified: true,
    },
    property: 'Appartement 2 chambres - Makepe',
    lastMessage: 'Bonjour, la propriété est-elle toujours disponible?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    unread: true,
  },
  {
    id: '2',
    user: {
      name: 'Marie Fotso',
      avatar: null,
      verified: false,
    },
    property: 'Studio moderne - Bastos',
    lastMessage: 'Merci pour les informations. Je vous recontacte bientôt.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: false,
  },
  {
    id: '3',
    user: {
      name: 'Paul Mbarga',
      avatar: null,
      verified: true,
    },
    property: 'Villa avec piscine - Bonanjo',
    lastMessage: 'Pouvons-nous organiser une visite ce weekend?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: false,
  },
];

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
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
  return date.toLocaleDateString('fr-FR');
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Gérez vos conversations</p>
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
      <div className="bg-white rounded-lg border divide-y">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune conversation</h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Aucune conversation ne correspond à votre recherche'
                : 'Vos conversations apparaîtront ici'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/dashboard/messages/${conversation.id}`}
              className={cn(
                'flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors',
                conversation.unread && 'bg-blue-50/50'
              )}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.user.avatar || undefined} />
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {getInitials(conversation.user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{conversation.user.name}</span>
                  {conversation.user.verified && <span className="text-green-500 text-sm">✓</span>}
                  {conversation.unread && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
                <p className="text-sm text-gray-500 truncate">{conversation.property}</p>
                <p
                  className={cn(
                    'text-sm truncate mt-1',
                    conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-600'
                  )}
                >
                  {conversation.lastMessage}
                </p>
              </div>

              <div className="text-xs text-gray-500 whitespace-nowrap">
                {formatTimestamp(conversation.timestamp)}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
