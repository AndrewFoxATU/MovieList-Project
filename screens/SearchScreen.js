// SearchScreen — shows popular movies on load, or search results when the user types.
// Tapping a movie navigates to MovieDetailScreen.
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN, POSTER_BASE_URL } from '../config';
import MovieCard from '../components/MovieCard';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load popular movies when the screen first opens
  useEffect(() => {
    fetchPopular();
  }, []);

  async function fetchPopular() {
    setLoading(true);
    try {
      const res = await fetch(`${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`, {
        headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (err) {
      console.error('Failed to load popular movies:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    // If the search box is empty, go back to showing popular movies
    if (!query.trim()) {
      fetchPopular();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
        { headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` } }
      );
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <FontAwesome name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {loading && <ActivityIndicator color="#e50914" style={{ marginTop: 20 }} />}

      <Text style={styles.sectionHeader}>
        {query.trim() ? 'Results' : 'Popular Movies'}
      </Text>

      {/* Movie list */}
      <FlatList
        data={results}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <MovieCard
            title={item.title}
            year={item.release_date?.slice(0, 4)}
            rating={item.vote_average}
            posterUri={item.poster_path ? `${POSTER_BASE_URL}${item.poster_path}` : null}
            onPress={() => navigation.navigate('MovieDetail', { movie: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 12 },
  sectionHeader: { color: '#888', fontSize: 13, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
});
