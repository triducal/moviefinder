import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/utils/supabase';
import { Colors, Fonts } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const theme = Colors.dark;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter your email.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push('/forgotpassword2');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.titleContainer}>
        <ThemedText style={[styles.title, { color: theme.text }]}>Film</ThemedText>
        <ThemedText style={[styles.title, { color: theme.text }]}>Finder</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText style={[styles.cardTitle, { color: theme.text }]}>Reset Password</ThemedText>

        <ThemedText style={[styles.label, { color: theme.textMuted }]}>Enter your email</ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={theme.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, { borderColor: theme.backgroundTertiary, color: theme.text }]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.brandPrimary }]}
          onPress={handleReset}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>{loading ? 'Sending…' : 'Send Reset Link'}</ThemedText>
        </TouchableOpacity>

        <Link href="/login">
          <ThemedText style={[styles.backToLogin, { color: theme.textMuted }]}>Back to Login</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, alignItems: 'center' },
  titleContainer: { marginBottom: 40 },
  title: { fontSize: 42, fontWeight: '700', lineHeight: 44, fontFamily: Fonts.sans },
  card: { width: '85%', paddingVertical: 28, paddingHorizontal: 22, borderRadius: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 22, fontFamily: Fonts.sans },
  label: { marginBottom: 6, fontSize: 14, fontFamily: Fonts.sans },
  input: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 16, fontSize: 16, fontFamily: Fonts.sans },
  button: { paddingVertical: 12, borderRadius: 8, marginBottom: 16 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center', fontFamily: Fonts.sans },
  backToLogin: { textAlign: 'center', fontSize: 14, marginTop: 4, textDecorationLine: 'underline', fontFamily: Fonts.sans },
});
