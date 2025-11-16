import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  // Filters
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("0");

  // Fetch genres
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
        );
        const json = await res.json();
        setGenres(json.genres || []);
      } catch (e) {
        console.error("Error fetching genres:", e);
      }
    })();
  }, []);

  // Perform search or discovery
  const fetchMovies = async () => {
    setLoading(true);
    try {
      let url = "";

      if (query.trim().length > 0) {
        url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&include_adult=false`;
      } else {
        url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=${sortBy}&include_adult=false`;
        if (selectedGenre) url += `&with_genres=${selectedGenre}`;
        if (year) url += `&primary_release_year=${year}`;
        if (minRating && minRating !== "0")
          url += `&vote_average.gte=${minRating}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error("Error fetching search results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [sortBy, selectedGenre, year, minRating]);

  const handleMoviePress = (id: number) => {
    router.push(`/movie/${id}`);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}
    >
      <View style={styles.container}>
        {/* Search bar */}
        <View
          style={[
            styles.searchRow,
            { backgroundColor: theme.backgroundTertiary },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.textMuted}
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            placeholder="Search movies..."
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={fetchMovies}
            style={[styles.input, { color: theme.text }]}
          />
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons
              name="filter"
              size={22}
              color={theme.textMuted}
              style={{ marginHorizontal: 8 }}
            />
          </TouchableOpacity>
        </View>

        {/* Results */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.brandPrimary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.movieCard}
                onPress={() => handleMoviePress(item.id)}
              >
                <Image
                  source={{
                    uri: item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : "https://via.placeholder.com/100x150.png?text=No+Image",
                  }}
                  style={[
                    styles.poster,
                    { backgroundColor: theme.backgroundTertiary },
                  ]}
                />
                <View style={styles.info}>
                  <ThemedText
                    type="subtitle"
                    style={[styles.title, { color: theme.text }]}
                  >
                    {item.title}
                  </ThemedText>
                  <View style={styles.metaRow}>
                    <ThemedText
                      style={[styles.meta, { color: theme.textMuted }]}
                    >
                      {item.release_date?.split("-")[0] ?? "Unknown Year"}
                    </ThemedText>
                    <ThemedText
                      style={[styles.dot, { color: theme.textMuted }]}
                    >
                      •
                    </ThemedText>
                    <Ionicons name="star" size={14} color={theme.ratingStar} />
                    <ThemedText
                      style={[styles.meta, { color: theme.textMuted }]}
                    >
                      {item.vote_average?.toFixed(1) ?? "N/A"}
                    </ThemedText>
                  </View>
                  <ThemedText
                    style={[styles.overview, { color: theme.textMuted }]}
                    numberOfLines={2}
                  >
                    {item.overview || "No description available."}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Filter Modal */}
        <Modal visible={filterVisible} transparent animationType="slide">
          <View
            style={[
              styles.modalOverlay,
              { backgroundColor: "rgba(0,0,0,0.7)" },
            ]}
          >
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <ThemedText
                  type="subtitle"
                  style={[styles.filterTitle, { color: theme.text }]}
                >
                  Filters
                </ThemedText>

                {/* Genre Filter */}
                <ThemedText style={[styles.label, { color: theme.textMuted }]}>
                  Genre
                </ThemedText>
                <View style={styles.genreList}>
                  {genres.map((g) => (
                    <Pressable
                      key={g.id}
                      onPress={() =>
                        setSelectedGenre(selectedGenre === g.id ? null : g.id)
                      }
                      style={[
                        styles.genreBadge,
                        {
                          backgroundColor:
                            selectedGenre === g.id
                              ? theme.brandPrimary
                              : theme.backgroundTertiary,
                        },
                      ]}
                    >
                      <ThemedText
                        style={{
                          color:
                            selectedGenre === g.id ? "#fff" : theme.textMuted,
                        }}
                      >
                        {g.name}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                {/* Sort Filter */}
                <ThemedText style={[styles.label, { color: theme.textMuted }]}>
                  Sort By
                </ThemedText>
                {[
                  ["popularity.desc", "Most Popular"],
                  ["vote_average.desc", "Highest Rated"],
                  ["release_date.desc", "Newest"],
                  ["release_date.asc", "Oldest"],
                ].map(([value, label]) => (
                  <Pressable
                    key={value}
                    onPress={() => setSortBy(value)}
                    style={[
                      styles.sortOption,
                      {
                        borderColor:
                          sortBy === value
                            ? theme.brandPrimary
                            : theme.backgroundTertiary,
                      },
                    ]}
                  >
                    <ThemedText
                      style={{
                        color:
                          sortBy === value ? theme.brandPrimary : theme.text,
                      }}
                    >
                      {label}
                    </ThemedText>
                  </Pressable>
                ))}

                {/* Year Filter */}
                <ThemedText style={[styles.label, { color: theme.textMuted }]}>
                  Release Year
                </ThemedText>
                <TextInput
                  placeholder="e.g. 2024"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  value={year}
                  onChangeText={setYear}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.backgroundTertiary,
                      color: theme.text,
                    },
                  ]}
                />

                {/* Minimum Rating Filter */}
                <ThemedText style={[styles.label, { color: theme.textMuted }]}>
                  Minimum Rating
                </ThemedText>
                <TextInput
                  placeholder="0–10"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  value={minRating}
                  onChangeText={setMinRating}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.backgroundTertiary,
                      color: theme.text,
                    },
                  ]}
                />

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      { borderColor: theme.textMuted },
                    ]}
                    onPress={() => setFilterVisible(false)}
                  >
                    <ThemedText style={{ color: theme.textMuted }}>
                      Cancel
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.applyButton,
                      { backgroundColor: theme.brandPrimary },
                    ]}
                    onPress={() => {
                      fetchMovies();
                      setFilterVisible(false);
                    }}
                  >
                    <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
                      Apply
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 6,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 6 },
  movieCard: { flexDirection: "row", marginTop: 16, gap: 12 },
  poster: { width: 80, height: 120, borderRadius: 8 },
  info: { flex: 1 },
  title: { fontWeight: "600", fontSize: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  meta: { fontSize: 13 },
  dot: { marginHorizontal: 5 },
  overview: { fontSize: 13, lineHeight: 18 },

  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "85%",
  },
  filterTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  label: { marginTop: 12, marginBottom: 6, fontSize: 14 },
  genreList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  sortOption: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  textInput: {
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  applyButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
});
