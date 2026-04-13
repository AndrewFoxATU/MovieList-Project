import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN, POSTER_BASE_URL } from '../config';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!query.trim()) {
      fetchPopular();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`, {
        headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
      });
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

      <FlatList
        data={results}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            onPress={() => navigation.navigate('MovieDetail', { movie: item })}
          >
            {item.poster_path ? (
              <Image source={{ uri: `${POSTER_BASE_URL}${item.poster_path}` }} style={styles.poster} />
            ) : (
              <View style={styles.poster} />
            )}
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.movieMeta}>{item.release_date?.slice(0, 4)}</Text>
              <View style={styles.ratingRow}>
                <FontAwesome name="star" size={12} color="#f5c518" />
                <Text style={styles.rating}> {item.vote_average?.toFixed(1)}</Text>
              </View>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#555" />
          </TouchableOpacity>
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
  movieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  poster: { width: 50, height: 75, borderRadius: 4, backgroundColor: '#333', marginRight: 12 },
  movieInfo: { flex: 1 },
  movieTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  movieMeta: { color: '#888', fontSize: 13, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { color: '#f5c518', fontSize: 13 },
});
