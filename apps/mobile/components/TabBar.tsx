import { usePathname, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows, spacing, tabBar, touchTarget, typography } from '../lib/tokens';

interface TabItem {
  name: string;
  href: '/(tabs)' | '/(tabs)/search' | '/(tabs)/saved' | '/(tabs)/messages' | '/(tabs)/profile';
  icon: string;
  labelKey: keyof typeof import('../i18n/locales/en.json')['tabs'];
}

const TAB_ITEMS: TabItem[] = [
  { name: 'index', href: '/(tabs)', icon: '🏠', labelKey: 'home' },
  { name: 'search', href: '/(tabs)/search', icon: '🔍', labelKey: 'search' },
  { name: 'saved', href: '/(tabs)/saved', icon: '❤️', labelKey: 'saved' },
  { name: 'messages', href: '/(tabs)/messages', icon: '💬', labelKey: 'messages' },
  { name: 'profile', href: '/(tabs)/profile', icon: '👤', labelKey: 'profile' },
];

interface TabButtonProps {
  item: TabItem;
  isActive: boolean;
  onPress: () => void;
  label: string;
}

function TabButton({ item, isActive, onPress, label }: TabButtonProps) {
  const activeColor = isActive ? tabBar.activeColor : tabBar.inactiveColor;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tabButton, pressed && styles.tabButtonPressed]}
    >
      <Text style={[styles.tabIcon, { opacity: isActive ? 1 : 0.7 }]}>{item.icon}</Text>
      <Text
        style={[styles.tabLabel, { color: activeColor }, isActive && styles.tabLabelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {isActive && <View style={styles.activeIndicator} />}
    </Pressable>
  );
}

export function TabBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Memoize active tab calculation
  const activeTab = useMemo(() => {
    // Match exact paths or default to index
    if (pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index') {
      return 'index';
    }
    const match = TAB_ITEMS.find((tab) => pathname.startsWith(tab.href) && tab.name !== 'index');
    return match?.name ?? 'index';
  }, [pathname]);

  // Stable callback to prevent re-renders
  const handleTabPress = useCallback(
    (href: TabItem['href']) => {
      router.push(href);
    },
    [router]
  );

  // Calculate bottom padding for safe area
  const bottomPadding = Math.max(insets.bottom, spacing.sm);
  const containerStyle: ViewStyle = {
    paddingBottom: bottomPadding,
  };

  return (
    <View style={[styles.container, containerStyle, shadows.md]} accessibilityRole="tablist">
      {TAB_ITEMS.map((item) => (
        <TabButton
          key={item.name}
          item={item}
          isActive={activeTab === item.name}
          onPress={() => handleTabPress(item.href)}
          label={t(`tabs.${item.labelKey}`)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: tabBar.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTarget.minSize,
    paddingVertical: spacing.xs,
    position: 'relative',
  },
  tabButtonPressed: {
    opacity: 0.7,
  },
  tabIcon: {
    fontSize: tabBar.iconSize,
    marginBottom: spacing.xs,
  },
  tabLabel: {
    fontSize: tabBar.labelSize,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: typography.fontWeight.semibold,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: tabBar.activeColor,
    borderRadius: 2,
  },
});
