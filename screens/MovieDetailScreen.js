import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN, POSTER_BASE_URL } from '../config';

export default function MovieDetailScreen({ route }) {
  const { movie } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  async function fetchDetails() {
    try {
      const res = await fetch(`${TMDB_BASE_URL}/movie/${movie.id}?language=en-US`, {
        headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
      });
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      console.error('Failed to load movie details:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToWatchlist() {
    // SQLite insert will go here
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  const data = details ?? movie;
  const posterUri = data.poster_path ? `${POSTER_BASE_URL}${data.poster_path}` : null;

  return (
    <ScrollView style={styles.container}>
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.poster} />
      ) : (
        <View style={styles.posterPlaceholder} />
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{data.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{data.release_date?.slice(0, 4)}</Text>
          {data.runtime ? <Text style={styles.metaText}>{data.runtime} min</Text> : null}
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={14} color="#f5c518" />
            <Text style={styles.rating}> {data.vote_average?.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.overview}>{data.overview}</Text>

        <TouchableOpacity style={styles.button} onPress={handleAddToWatchlist}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.buttonText}>  Add to Watchlist</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  poster: { width: '100%', height: 300, resizeMode: 'cover' },
  posterPlaceholder: { width: '100%', height: 300, backgroundColor: '#1e1e1e' },
  body: { padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  metaText: { color: '#888', fontSize: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { color: '#f5c518', fontSize: 14 },
  overview: { color: '#ccc', fontSize: 15, lineHeight: 24, marginBottom: 24 },
  button: {
    flexDirection: 'row',
    backgroundColor: '#e50914',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
