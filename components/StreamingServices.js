// StreamingServices
// - Purpose: Renders the "Where to Watch" section on MovieDetailScreen.
//   Extracted from MovieDetailScreen to keep that screen a manageable length.
// - Props:
//    - streaming: array of streaming options returned by the backend /streaming endpoint
//    - loading: boolean — shows a spinner while the RapidAPI fetch is in flight
// - Tapping a badge opens the streaming provider's URL via Linking.openURL (deep link).

import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from 'react-native';

// Brand colours for each known streaming service.
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

// Human-readable display names mapped from the service ID the API returns.
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

export default function StreamingServices({ streaming, loading }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Where to Watch</Text>

      {loading ? (
        <ActivityIndicator color="#e50914" style={{ marginTop: 8 }} />
      ) : streaming && streaming.length > 0 ? (
        <View style={styles.serviceRow}>
          {streaming.map((item, idx) => {
            // service.id from the API (e.g. "netflix") is used to look up colour and label.
            const key = item.service?.id?.toLowerCase();
            const color = SERVICE_COLORS[key] ?? '#333';
            const label = SERVICE_LABELS[key] ?? item.service?.name;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.serviceBadge, { backgroundColor: color }]}
                // Opens the provider's page for this title in the browser or native app.
                onPress={() => item.link && Linking.openURL(item.link)}
                activeOpacity={item.link ? 0.7 : 1}
              >
                <Text style={styles.serviceText}>{label}</Text>
                {/* Show how the title is available: subscription, rent, or buy */}
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
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  serviceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  serviceText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  serviceType: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
  noStreaming: { color: '#555', fontSize: 14, fontStyle: 'italic' },
});
