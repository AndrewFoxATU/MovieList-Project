import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('watchlist.db');

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

export function getAll(userId) {
  init();
  return db.getAllSync(
    'SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC;',
    [userId]
  );
}

export function add(userId, movie) {
  init();
  const { tmdb_id, title, poster_url = null, year = null, rating = null } = movie;
  db.runSync(
    'INSERT OR IGNORE INTO watchlist (user_id, tmdb_id, title, poster_url, year, rating) VALUES (?, ?, ?, ?, ?, ?);',
    [userId, tmdb_id, title, poster_url, year, rating]
  );
}

export function remove(userId, tmdbId) {
  init();
  db.runSync('DELETE FROM watchlist WHERE user_id = ? AND tmdb_id = ?;', [userId, tmdbId]);
}

export function isInWatchlist(userId, tmdbId) {
  init();
  const row = db.getFirstSync(
    'SELECT 1 FROM watchlist WHERE user_id = ? AND tmdb_id = ?;',
    [userId, tmdbId]
  );
  return row !== null;
}