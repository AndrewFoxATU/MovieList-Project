// MovieCard
// - Purpose: Reusable movie row used in SearchScreen and WatchlistScreen.
// - Props:
//    - title, year, rating, posterUri: movie data to display
//    - onPress: makes the whole row tappable and shows a chevron → used in Search
//    - onRemove: shows a trash icon button → used in Watchlist
//   (onPress and onRemove are mutually exclusive in practice)

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MovieCard({ title, year, rating, posterUri, onPress, onRemove }) {
  // Build the card content once and reuse it in both the touchable and non-touchable wrappers below.
  const content = (
    <>
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.poster} />
      ) : (
        // Grey placeholder shown while the image loads or if no poster exists.
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

      {/* Right-side action: trash button if deletable, chevron if navigable */}
      {onRemove ? (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome name="trash" size={20} color="#e50914" />
        </TouchableOpacity>
      ) : (
        <FontAwesome name="chevron-right" size={14} color="#555" />
      )}
    </>
  );

  // Wrap in TouchableOpacity if the card is tappable, plain View otherwise.
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
