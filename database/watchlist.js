import * as SQLite from 'expo-sqlite';

let db;

export async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('watchlist.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tmdb_id INTEGER UNIQUE,
        title TEXT,
        poster_url TEXT,
        year TEXT,
        rating REAL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return db;
}

export async function addToWatchlist(movie) {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO watchlist (tmdb_id, title, poster_url, year, rating)
     VALUES (?, ?, ?, ?, ?);`,
    [movie.tmdb_id, movie.title, movie.poster_url, movie.year, movie.rating]
  );
}

export async function removeFromWatchlist(tmdbId) {
  const db = await getDb();
  await db.runAsync('DELETE FROM watchlist WHERE tmdb_id = ?;', [tmdbId]);
}

export async function getWatchlist() {
  const db = await getDb();
  return await db.getAllAsync('SELECT * FROM watchlist ORDER BY added_at DESC;');
}

export async function isInWatchlist(tmdbId) {
  const db = await getDb();
  const row = await db.getFirstAsync(
    'SELECT id FROM watchlist WHERE tmdb_id = ?;',
    [tmdbId]
  );
  return !!row;
}
