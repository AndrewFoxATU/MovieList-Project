// SearchScreen
// - Purpose: Main discovery screen. Shows popular movies on load and
//   runs a search when the user submits a query. Uses the backend TMDB
//   proxy via useMovies — no API keys needed on the client.

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useMovies from '../hooks/useMovies';
import MovieCard from '../components/MovieCard';

// TMDB image CDN base — only the path comes from the API, the base URL is public.
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w342';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const { results, loading, loadPopular, searchMovies } = useMovies();

  // Load popular movies as soon as the screen mounts so there's always
  // something to show before the user types anything.
  useEffect(() => {
    loadPopular().catch(err => Alert.alert('Error', String(err.message ?? err)));
  }, []);

  async function handleSearch() {
    try {
      // useMovies.searchMovies falls back to loadPopular if query is empty.
      await searchMovies(query);
    } catch (err) {
      Alert.alert('Search failed', String(err.message ?? err));
    }
  }

  return (
    <View style={styles.container}>
      {/* Search bar — submits on the keyboard's search button */}
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

      {/* Section header changes label depending on whether a search is active */}
      <Text style={styles.sectionHeader}>
        {query.trim() ? 'Results' : 'Popular Movies'}
      </Text>

      <FlatList
        data={results}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <MovieCard
            title={item.title}
            year={item.release_date?.slice(0, 4)}
            rating={item.vote_average}
            posterUri={item.poster_path ? `${POSTER_BASE_URL}${item.poster_path}` : null}
            // Pass the full item to MovieDetailScreen so it can show basic info
            // immediately while the full TMDB details fetch completes.
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
  sectionHeader: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
