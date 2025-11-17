import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/utils/supabase';
import { Colors, Fonts } from '@/constants/theme';

export default function SignupScreen() {
  const theme = Colors.dark;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing details', 'Please fill out every field.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Re-enter your password correctly.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    setLoading(false);

    if (error) {
      Alert.alert('Unable to sign up', error.message);
    } else {
      Alert.alert(
        'Verify your email',
        'Check your inbox to complete your account setup.'
      );
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* PAGE TITLE */}
      <View style={styles.titleContainer}>
        <ThemedText style={[styles.title, { color: theme.text }]}>Film</ThemedText>
        <ThemedText style={[styles.title, { color: theme.text }]}>Finder</ThemedText>
      </View>

      {/* CARD */}
      <View style={[styles.card, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText style={[styles.cardTitle, { color: theme.text }]}>
          Create New Account
        </ThemedText>

        {/* Email */}
        <ThemedText style={[styles.label, { color: theme.textMuted }]}>
          Enter Email
        </ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email"
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundTertiary },
          ]}
        />

        {/* Password */}
        <ThemedText style={[styles.label, { color: theme.textMuted }]}>
          Enter Password
        </ThemedText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundTertiary },
          ]}
        />

        {/* Confirm Password */}
        <ThemedText style={[styles.label, { color: theme.textMuted }]}>
          Re-enter Password
        </ThemedText>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter Password"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundTertiary },
          ]}
        />

        {/* CREATE ACCOUNT BUTTON */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.brandPrimary }]}
          onPress={handleSignup}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Creating…' : 'Create Account'}
          </ThemedText>
        </TouchableOpacity>

        {/* BACK TO LOGIN */}
        <Link href="/login">
          <ThemedText
            style={[styles.backToLogin, { color: theme.textMuted }]}
          >
            Back to Login
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

  /** TITLE */
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 44,
    fontFamily: Fonts.sans,
  },

  /** CARD */
  card: {
    width: '85%',
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderRadius: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 22,
    fontFamily: Fonts.sans,
  },

  /** INPUTS */
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

  /** BUTTON */
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: Fonts.sans,
  },

  backToLogin: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 4,
    textDecorationLine: 'underline',
    fontFamily: Fonts.sans,
  },
});
