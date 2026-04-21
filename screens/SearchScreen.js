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

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w342';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const { results, loading, loadPopular, searchMovies } = useMovies();

  useEffect(() => {
    loadPopular().catch(err => {
      if (err.message) {
        Alert.alert('Error', String(err.message));
      } else {
        Alert.alert('Error', String(err));
      }
    });
  }, []);

  async function handleSearch() {
    try {
      await searchMovies(query);
    } catch (err) {
      if (err.message) {
        Alert.alert('Search failed', String(err.message));
      } else {
        Alert.alert('Search failed', String(err));
      }
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
        renderItem={({ item }) => {
          let year = null;
          if (item.release_date) {
            year = item.release_date.slice(0, 4);
          }

          let posterUri = null;
          if (item.poster_path) {
            posterUri = `${POSTER_BASE_URL}${item.poster_path}`;
          }

          return (
            <MovieCard
              title={item.title}
              year={year}
              rating={item.vote_average}
              posterUri={posterUri}
              onPress={() => navigation.navigate('MovieDetail', { movie: item })}
            />
          );
        }}
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
