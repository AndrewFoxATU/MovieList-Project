import { useState } from 'react';
import watchlistApi from '../api/watchlistApi';

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

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

  function addMovie(movie) {
    watchlistApi.addToWatchlist(movie);
    loadWatchlist();
  }

  function removeMovie(tmdbId) {
    watchlistApi.removeFromWatchlist(tmdbId);
    setWatchlist(prev => prev.filter(m => m.tmdb_id !== tmdbId));
  }

  function checkInWatchlist(tmdbId) {
    return watchlistApi.isInWatchlist(tmdbId);
  }

  return { watchlist, loading, loadWatchlist, addMovie, removeMovie, checkInWatchlist };
}