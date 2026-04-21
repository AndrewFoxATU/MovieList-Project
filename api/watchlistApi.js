// watchlistApi
// - Purpose: Thin wrapper around database/watchlist.js that automatically
//   scopes every query to the currently logged-in user. Screens and hooks
//   never need to pass a userId manually.
// - Exports:
//    - getWatchlist(): returns all saved movies for the current user
//    - addToWatchlist(movie): saves a movie to SQLite
//    - removeFromWatchlist(tmdbId): deletes a movie from SQLite
//    - isInWatchlist(tmdbId): returns true/false

import { getCurrentUserId } from './authToken';
import * as db from '../database/watchlist';

// Decodes the JWT (via authToken.js) to get the current user's ID.
// Every SQLite query is scoped to this ID so multiple accounts on the
// same device never see each other's watchlists.
function uid() {
  const id = getCurrentUserId();
  if (!id) throw new Error('Not authenticated');
  return id;
}

function getWatchlist() {
  return db.getAll(uid());
}

function addToWatchlist(movie) {
  db.add(uid(), movie);
}

function removeFromWatchlist(tmdbId) {
  db.remove(uid(), tmdbId);
}

function isInWatchlist(tmdbId) {
  return db.isInWatchlist(uid(), tmdbId);
}

export default { getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
