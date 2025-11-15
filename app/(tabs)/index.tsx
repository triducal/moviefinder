import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTIONS = [
  { title: "Trending Now" },
  { title: "Top Rated" },
  { title: "Recently Added" },
];

const movies = Array.from({ length: 6 }).map((_, i) => ({
  id: i.toString(),
  title: "Movie Title",
  rating: "4.4",
  image: "https://via.placeholder.com/100x150.png?text=Poster",
}));

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}
    >
      <ThemedView style={styles.container}>
        {SECTIONS.map((section) => (
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
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.movieCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={[
                      styles.poster,
                      { backgroundColor: theme.backgroundTertiary },
                    ]}
                  />
                  <ThemedText
                    style={[styles.movieTitle, { color: theme.text }]}
                  >
                    {item.title}
                  </ThemedText>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={theme.ratingStar} />
                    <ThemedText
                      style={[styles.ratingText, { color: theme.textMuted }]}
                    >
                      {item.rating}
                    </ThemedText>
                  </View>
                </View>
              )}
            />
          </ThemedView>
        ))}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
