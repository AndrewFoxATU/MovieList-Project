// Reusable movie row card.
// - Pass onPress to make the whole row tappable (shows a chevron) — used in Search
// - Pass onRemove to show a trash button — used in Watchlist
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MovieCard({ title, year, rating, posterUri, onPress, onRemove }) {
  const content = (
    <>
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.poster} />
      ) : (
        <View style={styles.poster} />
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.meta}>{year}</Text>
        <View style={styles.ratingRow}>
          <FontAwesome name="star" size={12} color="#f5c518" />
          <Text style={styles.rating}> {rating?.toFixed(1)}</Text>
        </View>
      </View>

      {onRemove ? (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome name="trash" size={20} color="#e50914" />
        </TouchableOpacity>
      ) : (
        <FontAwesome name="chevron-right" size={14} color="#555" />
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  poster: { width: 50, height: 75, borderRadius: 4, backgroundColor: '#333', marginRight: 12 },
  info: { flex: 1 },
  title: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  meta: { color: '#888', fontSize: 13, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { color: '#f5c518', fontSize: 13 },
});
