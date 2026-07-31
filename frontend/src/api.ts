import { useAuthStore } from './store/authStore';
import type {
  AccessTokenResponse,
  CreatePlayerInput,
  LoginInput,
  Player,
  PlayerStatus,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // .getState() reads the store's current value directly, without
  // subscribing to it — exactly what a plain (non-component) function
  // like this needs. Using the useAuthStore() hook form is only for
  // React components that should re-render when the value changes.
  const token = useAuthStore.getState().token;
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
  registerPlayer: (data: CreatePlayerInput) =>
    request<Player>('/players', { method: 'POST', body: JSON.stringify(data) }),

  playerLogin: ({ email, password }: LoginInput) =>
    request<AccessTokenResponse>('/players/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMyProfile: () => request<Player>('/players/me'),

  adminLogin: ({ email, password }: LoginInput) =>
    request<AccessTokenResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Admin-only: the player directory (all players, any status). No
  // public equivalent exists — this always sends the admin token.
  adminListPlayers: (status?: PlayerStatus) =>
    request<Player[]>(`/admin/players${status ? `?status=${status}` : ''}`),

  adminUpdateStatus: (id: string, status: PlayerStatus) =>
    request<Player>(`/admin/players/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
