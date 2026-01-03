import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { TabBar } from '../../components/TabBar';
import { colors } from '../../lib/tokens';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
