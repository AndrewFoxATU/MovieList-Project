import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { DEEPSEEK_API_KEY } from '../config';

export default function AIRecommendationsScreen() {
  // TODO: replace with real SQLite watchlist fetch
  const [watchlist] = useState([
    { title: 'Inception', year: '2010' },
    { title: 'Oppenheimer', year: '2023' },
  ]);

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recommendations automatically when the watchlist loads
  useEffect(() => {
    if (watchlist.length > 0) fetchRecommendations();
  }, []);

  async function fetchRecommendations() {
    setLoading(true);
    setError(null);
    setRecommendations([]);

    // Build the prompt from the user's watchlist
    const movieList = watchlist.map(m => `- ${m.title} (${m.year})`).join('\n');
    const prompt = `You are a movie recommendation expert. The user has watched:\n${movieList}\n\nRecommend exactly 5 movies they haven't seen. Reply ONLY with a JSON array:\n[{"title":"","year":"","genre":"","reason":""}]`;

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: 'Give me my recommendations.' },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message ?? 'Request failed');

      // DeepSeek returns the text inside choices[0].message.content
      const text = data.choices?.[0]?.message?.content ?? '[]';
      const parsed = JSON.parse(text);
      setRecommendations(parsed);
    } catch (err) {
      console.error(err);
      setError('Could not get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Show empty state if there are no movies in the watchlist
  if (watchlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5 name="film" size={48} color="#333" />
        <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
        <Text style={styles.emptySubtitle}>Add movies to your watchlist to get AI recommendations.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="brain" size={28} color="#e50914" />
        <Text style={styles.headerTitle}>AI Picks for You</Text>
        <Text style={styles.headerSubtitle}>Based on your watchlist</Text>
      </View>

      {/* Loading spinner */}
      {loading && (
        <View style={styles.loadingSection}>
          <ActivityIndicator color="#e50914" size="large" />
          <Text style={styles.loadingText}>Analysing your taste...</Text>
        </View>
      )}

      {/* Error message with retry */}
      {error && (
        <View style={styles.errorBox}>
          <FontAwesome5 name="exclamation-circle" size={16} color="#e50914" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchRecommendations} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recommendation cards */}
      {recommendations.length > 0 && (
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsLabel}>Recommended for you</Text>
            <TouchableOpacity onPress={fetchRecommendations}>
              <FontAwesome5 name="sync-alt" size={14} color="#888" />
            </TouchableOpacity>
          </View>

          {recommendations.map((rec, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{rec.title}</Text>
                  <View style={styles.cardMeta}>
                    {rec.year ? <Text style={styles.cardYear}>{rec.year}</Text> : null}
                    {rec.genre ? (
                      <View style={styles.genreBadge}>
                        <Text style={styles.genreText}>{rec.genre}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
              <Text style={styles.cardReason}>{rec.reason}</Text>
            </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  emptyContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { color: '#444', fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySubtitle: { color: '#333', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },

  header: { alignItems: 'center', paddingTop: 32, paddingBottom: 24, paddingHorizontal: 16 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  headerSubtitle: { color: '#888', fontSize: 14, marginTop: 6 },

  loadingSection: { alignItems: 'center', paddingVertical: 48 },
  loadingText: { color: '#555', fontSize: 14, marginTop: 12 },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#e50914',
    borderRadius: 8,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  errorText: { color: '#e50914', fontSize: 14, flex: 1 },
  retryButton: { paddingHorizontal: 10, paddingVertical: 4 },
  retryText: { color: '#e50914', fontWeight: '700', fontSize: 13 },

  resultsSection: { paddingHorizontal: 16 },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  resultsLabel: { color: '#888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },

  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e50914',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  rankText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardYear: { color: '#888', fontSize: 13 },
  genreBadge: { backgroundColor: '#2a2a2a', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  genreText: { color: '#888', fontSize: 12 },
  cardReason: { color: '#aaa', fontSize: 14, lineHeight: 20 },
});
