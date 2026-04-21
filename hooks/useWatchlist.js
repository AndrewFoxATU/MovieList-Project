// useWatchlist hook
// - Purpose: Wraps watchlistApi (which talks to SQLite) and exposes clean
//   state + actions to screens. Keeps all watchlist logic out of UI components.
// - Returns:
//    - watchlist: Array of saved movie objects for the current user
//    - loading: boolean while fetching from SQLite
//    - loadWatchlist(): re-reads all saved movies from the database
//    - addMovie(movie): saves a movie and refreshes the list
//    - removeMovie(tmdbId): removes a movie (optimistic local update, no refetch)
//    - checkInWatchlist(tmdbId): synchronous boolean check — used to set button state

import { useState } from 'react';
import watchlistApi from '../api/watchlistApi';

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reads the full watchlist from SQLite for the current user.
  // Called on screen focus (useFocusEffect) to keep the list fresh.
  function loadWatchlist() {
    setLoading(true);
    try {
      const data = watchlistApi.getWatchlist();
      setWatchlist(Array.isArray(data) ? data : []);
      return data;
    } finally {
      setLoading(false);
    }
  }

  // Persists a movie to SQLite then reloads the list so the UI reflects the
  // new entry immediately.
  function addMovie(movie) {
    watchlistApi.addToWatchlist(movie);
    loadWatchlist();
  }

  // Removes a movie from SQLite and does an optimistic local state update
  // (filter) instead of a full reload — faster for the user.
  function removeMovie(tmdbId) {
    watchlistApi.removeFromWatchlist(tmdbId);
    setWatchlist(prev => prev.filter(m => m.tmdb_id !== tmdbId));
  }

  // Synchronous check used by MovieDetailScreen to decide button label on focus.
  function checkInWatchlist(tmdbId) {
    return watchlistApi.isInWatchlist(tmdbId);
  }

  return { watchlist, loading, loadWatchlist, addMovie, removeMovie, checkInWatchlist };
}
