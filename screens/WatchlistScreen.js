// WatchlistScreen — shows movies saved to the SQLite watchlist.
// Reloads every time the tab is focused so it stays in sync with MovieDetailScreen.
import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getWatchlist, removeFromWatchlist } from '../database/watchlist';
import MovieCard from '../components/MovieCard';

export default function WatchlistScreen({ navigation }) {
  const [watchlist, setWatchlist] = useState([]);

  // Reload from SQLite every time this tab comes into focus
  useFocusEffect(
    useCallback(() => {
      getWatchlist().then(setWatchlist);
    }, [])
  );

  async function handleRemove(tmdbId) {
    await removeFromWatchlist(tmdbId);
    setWatchlist(prev => prev.filter(m => m.tmdb_id !== tmdbId));
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
          onPress={() => navigation.navigate('MovieDetail', { movie: { id: item.tmdb_id, title: item.title, poster_url: item.poster_url, release_date: item.year, vote_average: item.rating } })}
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
