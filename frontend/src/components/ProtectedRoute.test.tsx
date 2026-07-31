import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, afterEach } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '../store/authStore';

// A tiny stand-in page so we can check whether ProtectedRoute let us
// through to it or not — the test doesn't care what a real profile page
// looks like, only whether it rendered.
function FakeProfilePage() {
  return <p>secret profile content</p>;
}
function FakeLoginPage() {
  return <p>please log in</p>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<FakeLoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="player" redirectTo="/login">
              <FakeProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  afterEach(() => {
    // Each test starts from a clean, logged-out store — otherwise a
    // session set up in one test would leak into the next.
    useAuthStore.setState({ token: null, role: null, email: null });
  });

  it('redirects to the given path when nobody is logged in', () => {
    renderAt('/profile');

    expect(screen.getByText('please log in')).toBeInTheDocument();
    expect(screen.queryByText('secret profile content')).not.toBeInTheDocument();
  });

  it('redirects when logged in as the wrong role', () => {
    useAuthStore.getState().login('fake-admin-token', 'admin', 'owner@example.com');

    renderAt('/profile');

    expect(screen.getByText('please log in')).toBeInTheDocument();
  });

  it('renders the protected page when logged in as the right role', () => {
    useAuthStore.getState().login('fake-player-token', 'player', 'alex@example.com');

    renderAt('/profile');

    expect(screen.getByText('secret profile content')).toBeInTheDocument();
  });
});
