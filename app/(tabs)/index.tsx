import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const SECTIONS = [
  { title: "Trending Now", endpoint: "trending/movie/day" },
  { title: "Top Rated", endpoint: "movie/top_rated" },
  { title: "Now Playing", endpoint: "movie/now_playing" },
  { title: "Upcoming", endpoint: "movie/upcoming" },
];

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const [sections, setSections] = useState<Record<string, Movie[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data: Record<string, Movie[]> = {};
        for (const section of SECTIONS) {
          const res = await fetch(
            `${TMDB_BASE_URL}/${section.endpoint}?api_key=${TMDB_API_KEY}`
          );
          const json = await res.json();
          data[section.title] = json.results.slice(0, 10);
        }
        setSections(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}
      >
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.brandPrimary} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}
    >
      <ThemedView style={styles.container}>
        {SECTIONS.map((section) => {
          const movies = sections[section.title] || [];
          return (
            <ThemedView key={section.title} style={styles.section}>
              <ThemedText
                type="subtitle"
                style={[styles.sectionTitle, { color: theme.text }]}
              >
                {section.title}
              </ThemedText>

              <FlatList
                horizontal
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Link
                    href={{
                      pathname: `/movie/[id]`,
                      params: { id: item.id.toString() },
                    }}
                    asChild
                  >
                    <TouchableOpacity style={styles.movieCard}>
                      <Image
                        source={{
                          uri: item.poster_path
                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                            : "https://via.placeholder.com/100x150.png?text=No+Image",
                        }}
                        style={[
                          styles.poster,
                          { backgroundColor: theme.backgroundTertiary },
                        ]}
                      />
                      <ThemedText
                        style={[styles.movieTitle, { color: theme.text }]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </ThemedText>
                      <View style={styles.ratingRow}>
                        <Ionicons
                          name="star"
                          size={14}
                          color={theme.ratingStar}
                        />
                        <ThemedText
                          style={[
                            styles.ratingText,
                            { color: theme.textMuted },
                          ]}
                        >
                          {item.vote_average?.toFixed(1) ?? "N/A"}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  </Link>
                )}
              />
            </ThemedView>
          );
        })}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 8,
  },
  movieCard: {
    marginRight: 12,
    width: 100,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 6,
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
  },
});
