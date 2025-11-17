import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/utils/supabase';
import { Colors, Fonts } from '@/constants/theme';

export default function LoginScreen() {
  const theme = Colors.dark;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Enter both an email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) Alert.alert('Unable to log in', error.message);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <ThemedText style={[styles.title, { color: theme.text }]}>Film</ThemedText>
        <ThemedText style={[styles.title, { color: theme.text }]}>Finder</ThemedText>
      </View>

      {/* Card */}
      <View style={[styles.card, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText style={[styles.cardTitle, { color: theme.text }]}>LOGIN</ThemedText>

        {/* Email */}
        <ThemedText style={[styles.label, { color: theme.textMuted }]}>Email</ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email"
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { borderColor: theme.backgroundTertiary, color: theme.text }]}
        />

        {/* Password */}
        <ThemedText style={[styles.label, { color: theme.textMuted }]}>Password</ThemedText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          style={[styles.input, { borderColor: theme.backgroundTertiary, color: theme.text }]}
        />

        {/* Row: Remember + Forgot Password */}
        <View style={styles.row}>
          {/* Remember */}
          <Pressable onPress={() => setRemember(!remember)} style={styles.rememberRow}>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: theme.textMuted,
                  backgroundColor: remember ? theme.brandPrimary : 'transparent',
                },
              ]}
            />
            <ThemedText style={[styles.rememberText, { color: theme.textMuted }]}>Remember</ThemedText>
          </Pressable>

          {/* Forgot Password */}
          <Link href="/forgotpassword">
            <ThemedText style={[styles.forgot, { color: theme.brandPrimary }]}>
              Forgot Password?
            </ThemedText>
          </Link>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.brandPrimary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Signing in…' : 'SUBMIT'}
          </ThemedText>
        </TouchableOpacity>

        {/* Create Account */}
        <Link href="/signup">
          <ThemedText style={[styles.createAccount, { color: theme.text }]}>
            Create Account
          </ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, alignItems: 'center' },
  titleContainer: { marginBottom: 40 },
  title: { fontSize: 42, fontWeight: '700', lineHeight: 44, fontFamily: Fonts.sans },
  card: { width: '85%', padding: 26, borderRadius: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 22 },
  label: { marginBottom: 6, fontSize: 14, fontFamily: Fonts.sans },
  input: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: Fonts.sans,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  rememberText: { marginLeft: 4, fontSize: 14 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderRadius: 3 },
  forgot: { fontSize: 14, textDecorationLine: 'underline' },
  button: { paddingVertical: 12, borderRadius: 8, marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  createAccount: { fontSize: 14, textAlign: 'center', marginTop: 4 },
});
