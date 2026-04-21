// useMovies hook
// - Manages movie list, details, and streaming state for SearchScreen and MovieDetailScreen.
// - loadPopular / searchMovies update `results` (the list)
// - loadDetails fetches full TMDB data then chains a streaming fetch if imdb_id exists
// - clearDetails resets state on screen unmount so stale data doesn't flash

import { useState } from 'react';
import tmdbApi from '../api/tmdbApi';

export default function useMovies() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [streaming, setStreaming] = useState([]);
  const [streamingLoading, setStreamingLoading] = useState(false);

  async function loadPopular() {
    setLoading(true);
    try {
      const data = await tmdbApi.getPopular();
      setResults(data?.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  // Falls back to loadPopular if the query is empty so the list is never blank.
  async function searchMovies(query) {
    if (!query || !String(query).trim()) {
      return loadPopular();
    }
    setLoading(true);
    try {
      const data = await tmdbApi.searchMovies(query);
      setResults(data?.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  // Fetches TMDB details first, then chains a streaming fetch using imdb_id.
  // Two loading flags so movie info shows immediately while streaming still loads.
  async function loadDetails(id) {
    setDetailsLoading(true);
    setStreaming([]);
    try {
      const data = await tmdbApi.getMovieDetails(id);
      setDetails(data);
      if (data?.imdb_id) {
        setStreamingLoading(true);
        try {
          const s = await tmdbApi.getStreamingAvailability(data.imdb_id, 'ie');
          setStreaming(s?.options ?? []);
        } finally {
          setStreamingLoading(false);
        }
      }
      return data;
    } finally {
      setDetailsLoading(false);
    }
  }

  function clearDetails() {
    setDetails(null);
    setStreaming([]);
  }

  return {
    results, loading,
    details, detailsLoading,
    streaming, streamingLoading,
    loadPopular, searchMovies, loadDetails, clearDetails,
  };
}
