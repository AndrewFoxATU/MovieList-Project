// WatchlistScreen
// - Purpose: Displays all movies the user has saved to their local watchlist.
//   Reloads every time the tab comes into focus so adds/removes made in
//   MovieDetailScreen are immediately reflected here.

import { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useWatchlist from '../hooks/useWatchlist';
import MovieCard from '../components/MovieCard';

export default function WatchlistScreen({ navigation }) {
  const { watchlist, loading, loadWatchlist, removeMovie } = useWatchlist();

  // Reload the watchlist from SQLite every time this screen gains focus.
  // useCallback with [] prevents a new function being created on every render,
  // which would cause useFocusEffect to re-subscribe unnecessarily.
  useFocusEffect(
    useCallback(() => {
      try {
        loadWatchlist();
      } catch (err) {
        Alert.alert('Error', String(err.message ?? err));
      }
    }, [])
  );

  function handleRemove(tmdbId) {
    try {
      removeMovie(tmdbId);
    } catch (err) {
      Alert.alert('Error', String(err.message ?? err));
    }
  }

  // Show spinner only on the very first load (list is empty and still fetching).
  if (loading && watchlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  // Empty state shown after loading completes with no saved movies.
  if (watchlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="film" size={48} color="#333" />
        <Text style={styles.emptyText}>Your watchlist is empty</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={watchlist}
      keyExtractor={item => String(item.tmdb_id)}
      renderItem={({ item }) => (
        <MovieCard
          title={item.title}
          year={item.year}
          rating={item.rating}
          posterUri={item.poster_url}
          onPress={() => navigation.navigate('MovieDetail', {
            // SQLite stores tmdb_id/poster_url/year/rating — remap to the
            // shape MovieDetailScreen expects (same fields as a TMDB result).
            movie: {
              id: item.tmdb_id,
              title: item.title,
              poster_url: item.poster_url,
              release_date: item.year,
              vote_average: item.rating,
            },
          })}
          onRemove={() => handleRemove(item.tmdb_id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  emptyContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#444', fontSize: 16, marginTop: 12 },
});
