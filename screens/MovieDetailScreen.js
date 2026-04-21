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
    loadDetails(movie.id).catch(err => {
      if (err.message) {
        Alert.alert('Error', String(err.message));
      } else {
        Alert.alert('Error', String(err));
      }
    });
    return clearDetails;
  }, [movie.id]);

  useFocusEffect(
    useCallback(() => {
      setSaved(checkInWatchlist(movie.id));
    }, [movie.id])
  );

  function handleToggleWatchlist() {
    let data;
    if (details) {
      data = details;
    } else {
      data = movie;
    }

    try {
      if (saved) {
        removeMovie(data.id);
        setSaved(false);
      } else {
        let year = null;
        if (data.release_date) {
          year = data.release_date.slice(0, 4);
        }

        let rating = 0;
        if (data.vote_average) {
          rating = data.vote_average;
        }

        let posterUrl = null;
        if (data.poster_path) {
          posterUrl = `${POSTER_BASE_URL}${data.poster_path}`;
        } else if (data.poster_url) {
          posterUrl = data.poster_url;
        }

        addMovie({
          tmdb_id: data.id,
          title: data.title,
          year: year,
          rating: rating,
          poster_url: posterUrl,
        });
        setSaved(true);
      }
    } catch (err) {
      if (err.message) {
        Alert.alert('Error', String(err.message));
      } else {
        Alert.alert('Error', String(err));
      }
    }
  }

  if (detailsLoading && !details) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  let data;
  if (details) {
    data = details;
  } else {
    data = movie;
  }

  let posterUri = null;
  if (data.poster_path) {
    posterUri = `${POSTER_BASE_URL}${data.poster_path}`;
  } else if (data.poster_url) {
    posterUri = data.poster_url;
  }

  let releaseYear = null;
  if (data.release_date) {
    releaseYear = data.release_date.slice(0, 4);
  }

  let ratingText = '';
  if (data.vote_average) {
    ratingText = data.vote_average.toFixed(1);
  }

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
          <Text style={styles.metaText}>{releaseYear}</Text>
          {data.runtime ? <Text style={styles.metaText}>{data.runtime} min</Text> : null}
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={14} color="#f5c518" />
            <Text style={styles.rating}> {ratingText}</Text>
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
