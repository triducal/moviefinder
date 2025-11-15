import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/providers/AuthProvider';

export default function HomeScreen() {
  const { user } = useAuth();
  const firstLine = user?.email?.split('@')[0];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#6ab9ff', dark: '#0f172a' }}
      headerImage={
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Home
          </ThemedText>
        </ThemedView>
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Hello {firstLine ?? 'there'} 👋</ThemedText>
        <ThemedText style={styles.subtitle}>
          Welcome to your Supabase powered starter project. Use the tabs below to explore the
          different screens that are ready for you.
        </ThemedText>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Get started</ThemedText>
          <ThemedText>
            Visit the <Link href="/(tabs)/ask-ai">Ask AI</Link> tab to prototype your assistant
            experience or head to your <Link href="/(tabs)/profile">Profile</Link> to manage your
            account.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 36,
  },
  container: {
    gap: 16,
    padding: 20,
  },
  subtitle: {
    lineHeight: 22,
  },
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
});
