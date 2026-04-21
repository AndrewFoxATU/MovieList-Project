// authApi
// - Handles all authentication HTTP calls to the backend /auth routes.
// - login / signup both return { token, username } on success.
// - postPushToken registers the device for push notifications (wired, not yet active).

import { API_BASE_URL } from '../config';
import { getAuthHeaders } from './authToken';

// POST credentials to the backend, returns a JWT token on success.
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

// Creates a new account and returns a JWT — user is logged in immediately after signup.
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

// Sends the Expo push token to the backend so it can target this device for notifications.
// Requires auth header since the token must be linked to the logged-in user.
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
