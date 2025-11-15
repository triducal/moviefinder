import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function MoviePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  // Fetch movie details
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`
        );
        const json = await res.json();
        setMovie(json);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    })();
  }, [id]);

  // Fetch reviews from TMDB
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/${id}/reviews?api_key=${TMDB_API_KEY}`
        );
        const json = await res.json();
        setReviews(json.results || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    })();
  }, [id]);

  const handleTrailerPress = () => {
    const trailer = movie?.videos?.results?.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );
    if (trailer)
      Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`);
    else Alert.alert("No Trailer Found");
  };

  if (!movie) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}
      >
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const director =
    movie.credits?.crew?.find((c: any) => c.job === "Director")?.name ||
    "Unknown";
  const topCast =
    movie.credits?.cast
      ?.slice(0, 3)
      .map((c: any) => c.name)
      .join(", ") || "No cast listed";

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <ThemedText
          type="subtitle"
          style={[styles.headerTitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {movie.title}
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Poster with gradient overlay and trailer button */}
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/400x600.png?text=No+Image",
            }}
            style={styles.poster}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
            style={styles.posterOverlay}
          />
          <TouchableOpacity
            style={styles.trailerButton}
            onPress={handleTrailerPress}
          >
            <Ionicons name="play-circle" size={72} color="#ffffff" />
            <ThemedText style={[styles.trailerText, { color: "#fff" }]}>
              Watch Trailer
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <ThemedText
            type="subtitle"
            style={[styles.movieTitle, { color: theme.text }]}
          >
            {movie.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <ThemedText style={[styles.metaText, { color: theme.textMuted }]}>
              {movie.release_date?.split("-")[0] ?? "Unknown Year"}
            </ThemedText>
            <ThemedText style={[styles.dot, { color: theme.textMuted }]}>
              •
            </ThemedText>
            <ThemedText style={[styles.metaText, { color: theme.textMuted }]}>
              {movie.runtime ? `${movie.runtime} min` : "N/A"}
            </ThemedText>
            <ThemedText style={[styles.dot, { color: theme.textMuted }]}>
              •
            </ThemedText>
            <Ionicons name="star" size={14} color={theme.ratingStar} />
            <ThemedText style={[styles.metaText, { color: theme.textMuted }]}>
              {movie.vote_average?.toFixed(1) ?? "N/A"}
            </ThemedText>
          </View>

          <View style={styles.genreRow}>
            {movie.genres?.slice(0, 3).map((g: any) => (
              <View
                key={g.id}
                style={[
                  styles.genreBadge,
                  { backgroundColor: theme.backgroundTertiary },
                ]}
              >
                <ThemedText
                  style={[styles.genreText, { color: theme.textMuted }]}
                >
                  {g.name}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Add to List */}
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: theme.backgroundTertiary },
            ]}
            onPress={() =>
              Alert.alert("Coming Soon", "Lists not implemented yet")
            }
          >
            <Ionicons name="add" size={18} color={theme.text} />
            <ThemedText style={[styles.addButtonText, { color: theme.text }]}>
              Add to List
            </ThemedText>
          </TouchableOpacity>

          {/* Description */}
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.text }]}
          >
            Description
          </ThemedText>
          <ThemedText style={[styles.description, { color: theme.textMuted }]}>
            {movie.overview || "No description available."}
          </ThemedText>

          {/* Cast */}
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.text }]}
          >
            Cast & Crew
          </ThemedText>
          <ThemedText style={[styles.metaText, { color: theme.textMuted }]}>
            Director:{" "}
            <ThemedText style={{ color: theme.text }}>{director}</ThemedText>
          </ThemedText>
          <ThemedText
            style={[styles.metaText, { color: theme.textMuted, marginTop: 4 }]}
          >
            Cast:{" "}
            <ThemedText style={{ color: theme.text }}>{topCast}</ThemedText>
          </ThemedText>

          {/* Reviews from TMDB */}
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.text }]}
          >
            Reviews ({reviews.length})
          </ThemedText>

          {reviews.length === 0 ? (
            <ThemedText style={[styles.metaText, { color: theme.textMuted }]}>
              No reviews available.
            </ThemedText>
          ) : (
            reviews.map((r) => (
              <View
                key={r.id}
                style={[
                  styles.reviewCard,
                  { backgroundColor: theme.backgroundTertiary },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Ionicons name="person-circle" size={36} color={theme.icon} />
                  <View style={{ flex: 1 }}>
                    <ThemedText
                      style={{ color: theme.text, fontWeight: "600" }}
                    >
                      {r.author || "Anonymous"}
                    </ThemedText>
                    {r.author_details?.rating ? (
                      <View style={{ flexDirection: "row", marginTop: 2 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Ionicons
                            key={s}
                            name={
                              s <= Math.round(r.author_details.rating / 2)
                                ? "star"
                                : "star-outline"
                            }
                            size={12}
                            color={theme.ratingStar}
                          />
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>
                <ThemedText
                  style={[styles.reviewText, { color: theme.textMuted }]}
                  numberOfLines={5}
                >
                  {r.content}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: { marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", flexShrink: 1 },
  posterContainer: { position: "relative" },
  poster: { width: "100%", height: 420, resizeMode: "cover" },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0,
  },
  trailerButton: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    alignItems: "center",
    zIndex: 5,
  },
  trailerText: { marginTop: 6, fontSize: 15, fontWeight: "500" },
  infoContainer: { paddingHorizontal: 20 },
  movieTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  metaText: { fontSize: 14 },
  dot: { marginHorizontal: 6 },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  genreBadge: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
  genreText: { fontSize: 12 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 16,
  },
  addButtonText: { marginLeft: 6, fontSize: 14, fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },
  description: { fontSize: 14, lineHeight: 20 },
  reviewCard: { padding: 12, borderRadius: 10, marginTop: 10 },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  reviewText: { fontSize: 14 },
});
