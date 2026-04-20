// useMovies hook
// - Purpose: Encapsulates movie browsing + detail state, backed by the
//   ProjectBackend TMDB proxy. Used by SearchScreen (popular/search) and
//   MovieDetailScreen (details/streaming).
// - Returns:
//    - results: Array of TMDB movie summaries
//    - loading: boolean for list/search fetches
//    - details: last-loaded full movie object (MovieDetailScreen)
//    - detailsLoading: boolean for the details fetch
//    - streaming: Array of streaming services for the last fetched title
//    - streamingLoading: boolean for the streaming fetch
//    - loadPopular(): fetch TMDB popular list
//    - searchMovies(query): fetch TMDB search results
//    - loadDetails(id): fetch full movie details; also pulls streaming if imdb_id is present
//    - clearDetails(): reset details/streaming (useful when the screen unmounts)

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

  async function searchMovies(query) {
    if (!query || !String(query).trim()) {
      // Empty query -> fall back to popular, matching the original UX.
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
    results,
    loading,
    details,
    detailsLoading,
    streaming,
    streamingLoading,
    loadPopular,
    searchMovies,
    loadDetails,
    clearDetails,
  };
}
