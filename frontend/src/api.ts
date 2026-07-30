const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// One token, one role, one email. Whether it came from the player login
// or the admin login, it goes in the same localStorage keys — that's what
// lets a single ProtectedRoute (and the nav bar) check "is anyone logged
// in, and as what?" without needing to know which login page was used.
export function saveSession(
  accessToken: string,
  role: 'player' | 'admin',
  email: string,
) {
  localStorage.setItem('authToken', accessToken);
  localStorage.setItem('authRole', role);
  localStorage.setItem('authEmail', email);
}

export function clearSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authRole');
  localStorage.removeItem('authEmail');
}

export function getRole(): 'player' | 'admin' | null {
  const role = localStorage.getItem('authRole');
  return role === 'player' || role === 'admin' ? role : null;
}

export function getEmail(): string | null {
  return localStorage.getItem('authEmail');
}

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  registerPlayer: (data: unknown) =>
    request('/players', { method: 'POST', body: JSON.stringify(data) }),
  playerLogin: (email: string, password: string) =>
    request('/players/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMyProfile: () => request('/players/me'),
  adminLogin: (email: string, password: string) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  // Admin-only: the player directory (all players, any status). No
  // public equivalent exists — this always sends the admin token.
  adminListPlayers: (status?: string) =>
    request(`/admin/players${status ? `?status=${status}` : ''}`),
  adminUpdateStatus: (id: string, status: string) =>
    request(`/admin/players/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
