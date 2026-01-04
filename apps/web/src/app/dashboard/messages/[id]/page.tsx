'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mock conversation data
const mockMessages = [
  {
    id: '1',
    senderId: 'other',
    text: 'Bonjour, la propriété est-elle toujours disponible?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Bonjour! Oui, elle est toujours disponible. Êtes-vous intéressé pour une visite?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
  },
  {
    id: '3',
    senderId: 'other',
    text: 'Oui, je serais très intéressé. Quand serait-il possible de visiter?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '4',
    senderId: 'me',
    text: 'Je suis disponible samedi matin ou dimanche après-midi. Quelle date vous conviendrait?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
];

const otherUser = {
  name: 'Jean Kamga',
  verified: true,
};

const property = {
  title: 'Appartement 2 chambres - Makepe',
  price: '150 000 FCFA/mois',
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        senderId: 'me',
        text: newMessage,
        timestamp: new Date(),
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Link
          href="/dashboard/messages"
          className="text-gray-500 hover:text-gray-700"
        >
          ← Retour
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gray-200">
              {otherUser.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{otherUser.name}</span>
              {otherUser.verified && (
                <span className="text-green-500 text-sm">✓ Vérifié</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{property.title}</p>
          </div>
        </div>
        <Link href={`/properties/${params.id}`}>
          <Button variant="outline" size="sm">
            Voir la propriété
          </Button>
        </Link>
      </div>

      {/* Property Preview Card */}
      <div className="my-4 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
            🏠
          </div>
          <div>
            <p className="font-medium text-gray-900">{property.title}</p>
            <p className="text-sm text-[#FF385C] font-medium">{property.price}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.senderId === 'me' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-2xl px-4 py-2',
                message.senderId === 'me'
                  ? 'bg-[#FF385C] text-white'
                  : 'bg-gray-100 text-gray-900'
              )}
            >
              <p>{message.text}</p>
              <p
                className={cn(
                  'text-xs mt-1',
                  message.senderId === 'me' ? 'text-white/70' : 'text-gray-500'
                )}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
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
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  );
}

