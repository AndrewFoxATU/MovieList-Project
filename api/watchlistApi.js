import { getCurrentUserId } from './authToken';
import * as db from '../database/watchlist';

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