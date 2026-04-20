// WatchlistScreen
// - Purpose: Shows the user's server-side watchlist. Reloads every time the
//   tab comes into focus so adds/removes from MovieDetailScreen are reflected.

import { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useWatchlist from '../hooks/useWatchlist';
import MovieCard from '../components/MovieCard';

export default function WatchlistScreen({ navigation }) {
  const { watchlist, loading, loadWatchlist, removeMovie } = useWatchlist();

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

  if (loading && watchlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

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
