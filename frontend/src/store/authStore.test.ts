import { describe, it, expect, afterEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  afterEach(() => {
    useAuthStore.setState({ token: null, role: null, email: null });
    localStorage.clear();
  });

  it('starts logged out', () => {
    const state = useAuthStore.getState();
    expect(state.role).toBeNull();
    expect(state.token).toBeNull();
  });

  it('login() updates the store AND persists to localStorage', () => {
    useAuthStore.getState().login('abc123', 'player', 'alex@example.com');

    // The store itself:
    expect(useAuthStore.getState().role).toBe('player');
    expect(useAuthStore.getState().token).toBe('abc123');

    // The persistence layer underneath it — this is what survives a
    // page refresh, since the store re-reads these on module load.
    expect(localStorage.getItem('authToken')).toBe('abc123');
    expect(localStorage.getItem('authRole')).toBe('player');
    expect(localStorage.getItem('authEmail')).toBe('alex@example.com');
  });

  it('logout() clears both the store and localStorage', () => {
    useAuthStore.getState().login('abc123', 'admin', 'owner@example.com');

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().role).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
