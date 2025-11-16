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
  const theme = Colors.dark; // wireframe uses dark
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Enter both a username and password.');
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
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Film Finder Title */}
      <View style={styles.titleContainer}>
        <ThemedText style={[styles.title, { color: theme.text }]}>Film</ThemedText>
        <ThemedText style={[styles.title, { color: theme.text }]}>Finder</ThemedText>
      </View>

      {/* Login Card */}
      <View style={[styles.card, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText style={[styles.cardTitle, { color: theme.text }]}>
          LOGIN
        </ThemedText>

        {/* Username */}
        <ThemedText style={[styles.label, { color: theme.textMuted }]}>
          Username
        </ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter username"
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundTertiary },
          ]}
        />

        {/* Password */}
        <ThemedText style={[styles.label, { color: theme.textMuted }]}>
          Password
        </ThemedText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundTertiary },
          ]}
        />

        {/* Remember Me */}
        <Pressable
          onPress={() => setRemember(!remember)}
          style={styles.rememberRow}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: theme.textMuted,
                backgroundColor: remember
                  ? theme.brandPrimary
                  : 'transparent',
              },
            ]}
          />
          <ThemedText style={[styles.rememberText, { color: theme.textMuted }]}>
            Remember
          </ThemedText>
        </Pressable>

        {/* Submit button */}
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
          <ThemedText
            style={[styles.createAccount, { color: theme.text }]}
          >
            Create Account
          </ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
  },

  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 44,
    fontFamily: Fonts.sans,
  },

  card: {
    width: '85%',
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderRadius: 14,
  },

  cardTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 22,
    fontFamily: Fonts.sans,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
    fontFamily: Fonts.sans,
  },

  input: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: Fonts.sans,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 3,
    marginRight: 8,
  },

  rememberText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
  },

  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },

  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 16,
  },

  createAccount: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: Fonts.sans,
  },
});
