// MovieDetailScreen — shows full details for a selected movie.
// Also fetches streaming availability for Ireland via the Streaming Availability API.
import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN, POSTER_BASE_URL, STREAMING_RAPIDAPI_KEY } from '../config';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../database/watchlist';

// Brand colours and display names for each streaming service
const SERVICE_COLORS = {
  netflix: '#E50914',
  prime: '#00A8E1',
  disney: '#113CCF',
  hbo: '#5822a5',
  hulu: '#1CE783',
  apple: '#555555',
  paramount: '#0064FF',
  peacock: '#0F305F',
  mubi: '#000000',
};

const SERVICE_LABELS = {
  netflix: 'Netflix',
  prime: 'Prime Video',
  disney: 'Disney+',
  hbo: 'Max',
  hulu: 'Hulu',
  apple: 'Apple TV+',
  paramount: 'Paramount+',
  peacock: 'Peacock',
  mubi: 'MUBI',
};

export default function MovieDetailScreen({ route }) {
  const { movie } = route.params;

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState([]);
  const [streamingLoading, setStreamingLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  // Re-check watchlist status every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      isInWatchlist(movie.id).then(setSaved);
    }, [movie.id])
  );

  // Fetch full movie details from TMDB (includes runtime, imdb_id, etc.)
  async function fetchDetails() {
    try {
      const res = await fetch(`${TMDB_BASE_URL}/movie/${movie.id}?language=en-US`, {
        headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
      });
      const data = await res.json();
      setDetails(data);
      // Once we have the IMDB ID, fetch where it's streaming in Ireland
      if (data.imdb_id) fetchStreaming(data.imdb_id);
    } catch (err) {
      console.error('Failed to load movie details:', err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch Irish streaming availability using the Streaming Availability API
  async function fetchStreaming(imdbId) {
    setStreamingLoading(true);
    try {
      const res = await fetch(
        `https://streaming-availability.p.rapidapi.com/shows/${imdbId}?country=ie`,
        {
          headers: {
            'x-rapidapi-key': STREAMING_RAPIDAPI_KEY,
            'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
          },
        }
      );
      const data = await res.json();
      // streamingOptions.ie is an array of services available in Ireland
      setStreaming(data.streamingOptions?.ie ?? []);
    } catch (err) {
      console.error('Failed to load streaming info:', err);
    } finally {
      setStreamingLoading(false);
    }
  }

  async function handleToggleWatchlist() {
    const data = details ?? movie;
    if (saved) {
      await removeFromWatchlist(data.id);
      setSaved(false);
    } else {
      await addToWatchlist({
        tmdb_id: data.id,
        title: data.title,
        year: data.release_date?.slice(0, 4),
        rating: data.vote_average,
        poster_url: data.poster_path ? `${POSTER_BASE_URL}${data.poster_path}` : null,
      });
      setSaved(true);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  // Use detailed data if loaded, fall back to the basic movie object from search
  const data = details ?? movie;
  const posterUri = data.poster_path ? `${POSTER_BASE_URL}${data.poster_path}` : data.poster_url ?? null;

  return (
    <ScrollView style={styles.container}>
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.poster} />
      ) : (
        <View style={styles.posterPlaceholder} />
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{data.title}</Text>

        {/* Year · Runtime · Rating */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{data.release_date?.slice(0, 4)}</Text>
          {data.runtime ? <Text style={styles.metaText}>{data.runtime} min</Text> : null}
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={14} color="#f5c518" />
            <Text style={styles.rating}> {data.vote_average?.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.overview}>{data.overview}</Text>

        {/* Where to Watch (Ireland) */}
        <View style={styles.streamingSection}>
          <Text style={styles.sectionLabel}>Where to Watch</Text>
          {streamingLoading ? (
            <ActivityIndicator color="#e50914" style={{ marginTop: 8 }} />
          ) : streaming.length > 0 ? (
            <View style={styles.serviceRow}>
              {streaming.map((item, idx) => {
                const key = item.service?.id?.toLowerCase();
                const color = SERVICE_COLORS[key] ?? '#333';
                const label = SERVICE_LABELS[key] ?? item.service?.name;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.serviceBadge, { backgroundColor: color }]}
                    onPress={() => item.link && Linking.openURL(item.link)}
                    activeOpacity={item.link ? 0.7 : 1}
                  >
                    <Text style={styles.serviceText}>{label}</Text>
                    {item.type === 'subscription' && <Text style={styles.serviceType}>Subscription</Text>}
                    {item.type === 'rent' && <Text style={styles.serviceType}>Rent</Text>}
                    {item.type === 'buy' && <Text style={styles.serviceType}>Buy</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={styles.noStreaming}>Not currently streaming in Ireland</Text>
          )}
        </View>

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
  streamingSection: { marginBottom: 24 },
  sectionLabel: { color: '#888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  serviceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  serviceText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  serviceType: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
  noStreaming: { color: '#555', fontSize: 14, fontStyle: 'italic' },
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
