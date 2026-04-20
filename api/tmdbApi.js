// tmdbApi
// - Purpose: HTTP wrapper around ProjectBackend /tmdb/* proxy routes. The
//   backend attaches the real TMDB token server-side so no key ships in the
//   app. Response shapes match the original TMDB API so callers see no diff.
// - Exports:
//    - getPopular(page?)             -> { results: [...] }
//    - searchMovies(query, page?)    -> { results: [...] }
//    - getMovieDetails(id)           -> full movie object
//    - getStreamingAvailability(imdbId, country?) -> { streamingOptions, options }

import { API_BASE_URL } from '../config';
import { getAuthHeaders } from './authToken';

const jsonHeaders = () => ({ 'Content-Type': 'application/json', ...getAuthHeaders() });

async function getPopular(page = 1) {
  const res = await fetch(`${API_BASE_URL}/tmdb/popular?page=${page}`, { headers: jsonHeaders() });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${API_BASE_URL}/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`,
    { headers: jsonHeaders() }
  );
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

async function getMovieDetails(id) {
  const res = await fetch(`${API_BASE_URL}/tmdb/movie/${id}`, { headers: jsonHeaders() });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

// Streaming is proxied by /streaming (separate RapidAPI provider), but we
// keep the helper here so MovieDetailScreen's existing callers don't change.
async function getStreamingAvailability(imdbId, country = 'ie') {
  const res = await fetch(
    `${API_BASE_URL}/streaming/${imdbId}?country=${country}`,
    { headers: jsonHeaders() }
  );
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export default { getPopular, searchMovies, getMovieDetails, getStreamingAvailability };
