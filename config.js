// Central config — all API keys are read from .env so they are never hardcoded
export const API_BASE_URL = ''; // EC2 backend URL (not yet deployed)

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w342';

export const STREAMING_RAPIDAPI_KEY = process.env.EXPO_PUBLIC_STREAMING_RAPIDAPI_KEY;
export const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
