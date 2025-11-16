import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";

const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function AskAiScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "ai-1",
      sender: "ai",
      text: "Hi! I’m your personal AI movie assistant. I can recommend movies, describe plots, or find similar films for you. What are you in the mood for today?",
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

    try {
      const response = await axios.post(
        DEEPSEEK_URL,
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                'You are a movie recommendation assistant. When recommending movies, include both a short natural-language response and a JSON object with movie titles and release years, formatted like:\n```json\n{"recommendations": [{"title": "Inception", "year": 2010}]}\n```\nDo not include markdown around the JSON except the triple backticks. Keep text concise and conversational.',
            },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: question },
          ],
          temperature: 0.8,
          max_tokens: 400,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          },
        }
      );

      const aiRaw = response.data.choices?.[0]?.message?.content || "";
      const jsonMatch = aiRaw.match(/```json([\s\S]*?)```/);

      let aiText = aiRaw.replace(/```json[\s\S]*?```/, "").trim();
      let recommendations: any[] = [];

      if (jsonMatch) {
        try {
          const json = JSON.parse(jsonMatch[1]);
          recommendations = json.recommendations || [];
        } catch (err) {
          console.warn("Error parsing DeepSeek JSON:", err);
        }
      }

      // Fetch TMDB info for each recommendation
      let movieDetails: any[] = [];
      if (recommendations.length > 0) {
        const results = await Promise.all(
          recommendations.map(async (rec) => {
            try {
              const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
                rec.title
              )}&year=${rec.year || ""}`;
              const res = await fetch(searchUrl);
              const data = await res.json();
              return data.results?.[0] || null;
            } catch {
              return null;
            }
          })
        );
        movieDetails = results.filter(Boolean);
      }

      const aiResponse = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        movies: movieDetails,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      console.error("DeepSeek Error:", error.response?.data || error.message);
      const errorMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "Sorry, there was an issue reaching the AI. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSubmitting(false);
    }
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
              Discover your next favorite movie
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
                  {/* Markdown text support */}
                  <Markdown
                    style={{
                      body: {
                        color: item.sender === "ai" ? theme.text : "#fff",
                        fontSize: 15,
                        lineHeight: 20,
                      },
                      strong: { fontWeight: "700" },
                      em: { fontStyle: "italic" },
                      bullet_list: { color: theme.text },
                    }}
                  >
                    {item.text}
                  </Markdown>

                  {/* Movie recommendations */}
                  {item.movies && item.movies.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{ marginTop: 10 }}
                    >
                      {item.movies.map((movie) => (
                        <TouchableOpacity
                          key={movie.id}
                          onPress={() => router.push(`/movie/${movie.id}`)}
                          style={{ marginRight: 12 }}
                        >
                          <Image
                            source={{
                              uri: movie.poster_path
                                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                : "https://via.placeholder.com/100x150.png?text=No+Image",
                            }}
                            style={{
                              width: 100,
                              height: 150,
                              borderRadius: 10,
                              backgroundColor: theme.backgroundTertiary,
                            }}
                          />
                          <ThemedText
                            style={{
                              color: theme.text,
                              fontSize: 12,
                              marginTop: 4,
                              width: 100,
                            }}
                            numberOfLines={2}
                          >
                            {movie.title}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
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
