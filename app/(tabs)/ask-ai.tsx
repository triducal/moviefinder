import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

export default function AskAiScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "ai-1",
      sender: "ai",
      text: "Hi! I’m your personal AI movie assistant. I can help you discover movies based on your preferences or requests. What kind of movies are you in the mood for today?",
    },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setSubmitting(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 800));
    const aiResponse = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: "This is a placeholder response. Hook this up to your AI API or Supabase Edge Function.",
    };
    setMessages((prev) => [...prev, aiResponse]);
    setSubmitting(false);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText
              type="title"
              style={[styles.title, { color: theme.text }]}
            >
              AI Movie Assistant
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textMuted }]}>
              Get personalized recommendations
            </ThemedText>
          </View>

          {/* Chat messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatContainer}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageRow,
                  item.sender === "ai" ? styles.aiRow : styles.userRow,
                ]}
              >
                {item.sender === "ai" && (
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: theme.backgroundTertiary },
                    ]}
                  >
                    <ThemedText
                      style={{ color: theme.text, fontWeight: "600" }}
                    >
                      AI
                    </ThemedText>
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor:
                        item.sender === "ai"
                          ? theme.backgroundSecondary
                          : theme.brandPrimary,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: item.sender === "ai" ? theme.text : "#fff",
                    }}
                  >
                    {item.text}
                  </ThemedText>
                </View>
              </View>
            )}
          />

          {/* Input bar */}
          <View
            style={[styles.inputRow, { borderColor: theme.backgroundTertiary }]}
          >
            <TextInput
              value={question}
              onChangeText={setQuestion}
              placeholder="Ask for movie recommendations..."
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text }]}
              editable={!submitting}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: submitting
                    ? theme.backgroundTertiary
                    : theme.brandPrimary,
                },
              ]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="send" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 8 },
  header: {
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 8,
  },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 14 },
  chatContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  aiRow: { justifyContent: "flex-start" },
  userRow: { justifyContent: "flex-end" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 8,
  },
});
