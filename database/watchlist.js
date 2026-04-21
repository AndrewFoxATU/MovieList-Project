// database/watchlist.js
// - Purpose: Local SQLite persistence for the user's watchlist using Expo SQLite.
//   Each user's movies are stored with their user_id so multiple accounts on the
//   same device stay separated. The UNIQUE(user_id, tmdb_id) constraint prevents
//   a movie being saved twice without needing to check first.
// - All functions call init() at the start so the table always exists before any
//   query runs (idempotent CREATE TABLE IF NOT EXISTS).
// - Uses synchronous Expo SQLite API (execSync, runSync, etc.) because watchlists
//   are small and the simpler sync code outweighs any async benefit here.

import * as SQLite from 'expo-sqlite';

// Opens (or creates) the on-device SQLite database file.
const db = SQLite.openDatabaseSync('watchlist.db');

// Creates the watchlist table the first time the app runs. Safe to call repeatedly.
function init() {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      tmdb_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      poster_url TEXT,
      year TEXT,
      rating REAL,
      added_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, tmdb_id)
    );`
  );
}

// Returns all saved movies for a given user, newest first.
export function getAll(userId) {
  init();
  return db.getAllSync(
    'SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC;',
    [userId]
  );
}

// Inserts a movie for a user. INSERT OR IGNORE means duplicates are silently
// skipped thanks to the UNIQUE constraint — no extra check needed.
export function add(userId, movie) {
  init();
  const { tmdb_id, title, poster_url = null, year = null, rating = null } = movie;
  db.runSync(
    'INSERT OR IGNORE INTO watchlist (user_id, tmdb_id, title, poster_url, year, rating) VALUES (?, ?, ?, ?, ?, ?);',
    [userId, tmdb_id, title, poster_url, year, rating]
  );
}

// Deletes a specific movie for a user by their tmdb_id.
export function remove(userId, tmdbId) {
  init();
  db.runSync('DELETE FROM watchlist WHERE user_id = ? AND tmdb_id = ?;', [userId, tmdbId]);
}

// Returns true if the movie is already in the user's watchlist, false otherwise.
// Uses SELECT 1 (cheapest possible query — just checks row existence).
export function isInWatchlist(userId, tmdbId) {
  init();
  const row = db.getFirstSync(
    'SELECT 1 FROM watchlist WHERE user_id = ? AND tmdb_id = ?;',
    [userId, tmdbId]
  );
  return row !== null;
}
