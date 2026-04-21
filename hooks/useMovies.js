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
      if (data && data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function searchMovies(query) {
    if (!query || !String(query).trim()) {
      return loadPopular();
    }
    setLoading(true);
    try {
      const data = await tmdbApi.searchMovies(query);
      if (data && data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
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
      if (data && data.imdb_id) {
        setStreamingLoading(true);
        try {
          const s = await tmdbApi.getStreamingAvailability(data.imdb_id, 'ie');
          if (s && s.options) {
            setStreaming(s.options);
          } else {
            setStreaming([]);
          }
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
