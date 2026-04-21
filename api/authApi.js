// authApi
// - Handles all authentication HTTP calls to the backend /auth routes.
// - login / signup both return { token, username } on success.

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


export default { login, signup};
