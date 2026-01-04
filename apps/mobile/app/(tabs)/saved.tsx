import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/PropertyCard';

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

export default function SavedScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Use Convex if available, returns empty array in demo mode
  const savedProperties = api ? useQuery(api.savedProperties.getSavedProperties) : [];

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('saved.title')}</Text>
        <Text style={styles.subtitle}>
          {savedProperties?.length ?? 0} {t('saved.properties')}
        </Text>
      </View>

      <FlashList
        data={savedProperties ?? []}
        renderItem={({ item }) => (
          <PropertyCard
            property={item.property}
            onPress={() => handlePropertyPress(item.property._id)}
            showSaveButton
          />
        )}
        estimatedItemSize={280}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>❤️</Text>
            <Text style={styles.emptyTitle}>{t('saved.emptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('saved.emptyDescription')}</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
