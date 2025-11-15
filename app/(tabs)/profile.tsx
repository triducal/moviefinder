import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Unable to sign out', message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your profile</ThemedText>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Email</ThemedText>
        <ThemedText>{user?.email}</ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <ThemedText style={styles.buttonText}>Sign out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
  },
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  button: {
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
