import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';

export default function ForgotPassword2Screen() {
  const theme = Colors.dark;
  const router = useRouter();

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.titleContainer}>
        <ThemedText style={[styles.title, { color: theme.text }]}>Film</ThemedText>
        <ThemedText style={[styles.title, { color: theme.text }]}>Finder</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Check your email</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textMuted }]}>
          We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.
        </ThemedText>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.brandPrimary }]}
          onPress={() => router.push('/login')}
        >
          <ThemedText style={styles.buttonText}>Back to Login</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, alignItems: 'center' },
  titleContainer: { marginBottom: 40 },
  title: { fontSize: 42, fontWeight: '700', lineHeight: 44, fontFamily: Fonts.sans },
  card: { width: '85%', paddingVertical: 28, paddingHorizontal: 22, borderRadius: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12, fontFamily: Fonts.sans },
  subtitle: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 20, fontFamily: Fonts.sans },
  button: { paddingVertical: 12, borderRadius: 8, marginBottom: 16 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center', fontFamily: Fonts.sans },
});
