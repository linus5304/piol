import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatRelativeTime } from '../../lib/utils';

// Conditionally import Convex
let api: any = null;
let useQuery: any = () => undefined;

try {
  api = require('../../convex/_generated/api').api;
  const convex = require('convex/react');
  useQuery = convex.useQuery;
} catch (e) {
  console.warn('Convex not available');
}

export default function MessagesScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Use Convex if available, returns empty array in demo mode
  const conversations = api ? useQuery(api.messages.getConversations) : [];

  const handleConversationPress = (conversationId: string) => {
    router.push(`/chat/${conversationId}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('messages.title')}</Text>
      </View>

      <FlashList
        data={conversations ?? []}
        renderItem={({ item }) => (
          <Pressable
            style={styles.conversationItem}
            onPress={() => handleConversationPress(item.conversationId)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.otherUser?.firstName?.[0] ?? '?'}</Text>
            </View>
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>
                  {item.otherUser?.firstName} {item.otherUser?.lastName}
                </Text>
                <Text style={styles.conversationTime}>
                  {formatRelativeTime(item.lastMessage.timestamp)}
                </Text>
              </View>
              {item.property && (
                <Text style={styles.propertyName} numberOfLines={1}>
                  {item.property.title}
                </Text>
              )}
              <Text
                style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]}
                numberOfLines={1}
              >
                {item.lastMessage.isFromMe ? `${t('messages.you')}: ` : ''}
                {item.lastMessage.text}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </Pressable>
        )}
        estimatedItemSize={80}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>{t('messages.emptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('messages.emptyDescription')}</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  conversationTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  propertyName: {
    fontSize: 13,
    color: '#FF385C',
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  lastMessageUnread: {
    color: '#111827',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#FF385C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 78,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
