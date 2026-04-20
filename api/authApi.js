// authApi
// - Purpose: Auth HTTP calls against ProjectBackend /auth routes.
// - Exports:
//    - login(username, password): POST /auth/login  -> { token, username }
//    - signup(username, password): POST /auth/signup -> { token, username }
//    - postPushToken(expoPushToken): POST /auth/push-token (authenticated)
// - Notes: Throws on non-OK responses. The backend expects `username` (not email).

import { API_BASE_URL } from '../config';
import { getAuthHeaders } from './authToken';

async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function signup(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Signup failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function postPushToken(expoPushToken) {
  const res = await fetch(`${API_BASE_URL}/auth/push-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ pushToken: expoPushToken }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Push token registration failed: ${res.status} ${text}`);
  }
  try { return await res.json(); } catch { return null; }
}

export default { login, signup, postPushToken };
