// MovieDetailScreen
// - Purpose: Full details view for a movie. Uses useMovies for TMDB details
//   + streaming availability, useWatchlist for saved state. Streaming row is
//   now its own component (StreamingServices) to keep this screen readable.

import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useMovies from '../hooks/useMovies';
import useWatchlist from '../hooks/useWatchlist';
import StreamingServices from '../components/StreamingServices';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w342';

export default function MovieDetailScreen({ route }) {
  const { movie } = route.params;
  const { details, detailsLoading, streaming, streamingLoading, loadDetails, clearDetails } = useMovies();
  const { addMovie, removeMovie, checkInWatchlist } = useWatchlist();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadDetails(movie.id).catch(err => Alert.alert('Error', String(err.message ?? err)));
    return clearDetails;
  }, [movie.id]);

  // Re-check watchlist status every time this screen gets focus so the
  // button stays in sync if the user removed it from the Watchlist tab.
  useFocusEffect(
    useCallback(() => {
      setSaved(checkInWatchlist(movie.id));
    }, [movie.id])
  );

  function handleToggleWatchlist() {
    const data = details ?? movie;
    try {
      if (saved) {
        removeMovie(data.id);
        setSaved(false);
      } else {
        addMovie({
          tmdb_id: data.id,
          title: data.title,
          year: data.release_date?.slice(0, 4) ?? null,
          rating: data.vote_average ?? 0,
          poster_url: data.poster_path ? `${POSTER_BASE_URL}${data.poster_path}` : (data.poster_url ?? null),
        });
        setSaved(true);
      }
    } catch (err) {
      Alert.alert('Error', String(err.message ?? err));
    }
  }

  if (detailsLoading && !details) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  const data = details ?? movie;
  const posterUri = data.poster_path
    ? `${POSTER_BASE_URL}${data.poster_path}`
    : (data.poster_url ?? null);

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
            <Text style={styles.rating}> {data.vote_average?.toFixed?.(1)}</Text>
          </View>
        </View>

        <Text style={styles.overview}>{data.overview}</Text>

        <StreamingServices streaming={streaming} loading={streamingLoading} />

        <TouchableOpacity
          style={[styles.button, saved && styles.buttonSaved]}
          onPress={handleToggleWatchlist}
        >
          <FontAwesome name={saved ? 'minus' : 'plus'} size={16} color="#fff" />
          <Text style={styles.buttonText}>  {saved ? 'Remove from Watchlist' : 'Add to Watchlist'}</Text>
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
  buttonSaved: { backgroundColor: '#333' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
