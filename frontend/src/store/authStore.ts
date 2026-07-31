import { create } from 'zustand';

export type Role = 'player' | 'admin' | null;

interface AuthState {
  token: string | null;
  role: Role;
  email: string | null;
  login: (token: string, role: 'player' | 'admin', email: string) => void;
  logout: () => void;
}

// localStorage is still the actual persistence — it's what survives a
// page refresh. Zustand's job is different: it's the reactive layer on
// top, so that any component using this store (Nav, ProtectedRoute)
// re-renders the instant login()/logout() is called, rather than only
// finding out the next time something else happens to trigger a
// re-render. That's a real bug class this fixes, not just tidiness:
// reading localStorage directly in a component only reflects its value
// at the moment that component happens to render — nothing forces it to
// notice a change that happened elsewhere.
function readInitialState(): Pick<AuthState, 'token' | 'role' | 'email'> {
  const role = localStorage.getItem('authRole');
  return {
    token: localStorage.getItem('authToken'),
    role: role === 'player' || role === 'admin' ? role : null,
    email: localStorage.getItem('authEmail'),
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readInitialState(),

  login: (token, role, email) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authRole', role);
    localStorage.setItem('authEmail', email);
    set({ token, role, email });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
    localStorage.removeItem('authEmail');
    set({ token: null, role: null, email: null });
  },
}));
