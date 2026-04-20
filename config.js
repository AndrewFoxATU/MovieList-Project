// config
// - Purpose: Central runtime config. Only the backend base URL lives here now;
//   TMDB and AI keys are handled server-side by ProjectBackend, so they no
//   longer need to ship in the app.
// - Usage: set EXPO_PUBLIC_API_BASE_URL in .env, or edit the fallback below.

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL;
