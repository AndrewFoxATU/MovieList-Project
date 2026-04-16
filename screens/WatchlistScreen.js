// WatchlistScreen — displays the user's saved movies.
// SQLite fetch and delete will be wired up here when the DB is ready.
import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function WatchlistScreen() {
  // TODO: replace with real SQLite fetch
  const [watchlist, setWatchlist] = useState([]);

  function handleRemove(id) {
    // TODO: delete from SQLite, then update state
    setWatchlist(prev => prev.filter(m => m.id !== id));
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
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.movieCard}>
          <View style={styles.poster} />
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieMeta}>{item.year}</Text>
            <View style={styles.ratingRow}>
              <FontAwesome name="star" size={12} color="#f5c518" />
              <Text style={styles.rating}> {item.rating}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleRemove(item.id)}>
            <FontAwesome name="trash" size={20} color="#e50914" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  emptyContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#444', fontSize: 16, marginTop: 12 },
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
