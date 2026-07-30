import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, afterEach } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

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
    // Each test starts from a clean browser state — otherwise a token
    // saved in one test would leak into the next.
    localStorage.clear();
  });

  it('redirects to the given path when nobody is logged in', () => {
    renderAt('/profile');

    expect(screen.getByText('please log in')).toBeInTheDocument();
    expect(screen.queryByText('secret profile content')).not.toBeInTheDocument();
  });

  it('redirects when logged in as the wrong role', () => {
    localStorage.setItem('authToken', 'fake-admin-token');
    localStorage.setItem('authRole', 'admin');

    renderAt('/profile');

    expect(screen.getByText('please log in')).toBeInTheDocument();
  });

  it('renders the protected page when logged in as the right role', () => {
    localStorage.setItem('authToken', 'fake-player-token');
    localStorage.setItem('authRole', 'player');

    renderAt('/profile');

    expect(screen.getByText('secret profile content')).toBeInTheDocument();
  });
});
