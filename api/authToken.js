// authToken
// - Purpose: Module-level JWT shared across every api/ module. Mirrors the
//   ShopDemo pattern so the token only needs to be set once (from AuthContext)
//   and every fetch picks it up via getAuthHeaders().
// - Exports: getToken(), setToken(t), getAuthHeaders()

let _token = null;

export function setToken(t) {
  _token = t;
}

export function getToken() {
  return _token;
}

export function getAuthHeaders() {
  return _token ? { Authorization: `Bearer ${_token}` } : {};
}

// Decodes the JWT payload to extract the user identifier (sub or username).
// Returns null when no token is set or the token is malformed.
export function getCurrentUserId() {
  if (!_token) return null;
  try {
    const payload = JSON.parse(atob(_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return String(payload.sub ?? payload.username ?? payload.id);
  } catch {
    return null;
  }
}
