import { API_BASE_URL } from '../config';
import { getAuthHeaders } from './authToken';

async function getProfile() {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

// base64Image: full data URI string — "data:image/jpeg;base64,..."
async function uploadProfilePhoto(base64Image) {
  const res = await fetch(`${API_BASE_URL}/auth/profile/photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ photo: base64Image }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default { getProfile, uploadProfilePhoto };