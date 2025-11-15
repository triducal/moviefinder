import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AskAiScreen() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      return;
    }

    setSubmitting(true);
    // Replace this with your AI integration or Supabase Edge Function call.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setResponse(
      'This is a placeholder response. Connect your AI provider or Supabase Function to power this screen.',
    );
    setSubmitting(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Ask the AI</ThemedText>
      <ThemedText style={styles.subtitle}>
        Prototype questions for your assistant. When you hook this screen up to your backend or an Edge
        Function, show the answer below.
      </ThemedText>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Ask anything..."
        style={styles.input}
        placeholderTextColor="#9ca3af"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Send</ThemedText>}
      </TouchableOpacity>
      {response ? (
        <ThemedView style={styles.response}>
          <ThemedText type="subtitle">AI response</ThemedText>
          <ThemedText>{response}</ThemedText>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
  },
  subtitle: {
    lineHeight: 22,
  },
  input: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#6366f1',
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  response: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
});
