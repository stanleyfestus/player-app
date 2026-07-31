import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, afterEach } from 'vitest';
import Nav from './Nav';
import { useAuthStore } from '../store/authStore';

function renderNav() {
  return render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
  );
}

describe('Nav', () => {
  afterEach(() => {
    // Reset the store directly, the same way the real logout() does —
    // now that state lives in Zustand rather than being re-read from
    // localStorage on every render, tests set it up the same way the app
    // itself does: through the store's own API, not by poking
    // localStorage and hoping something re-reads it.
    useAuthStore.setState({ token: null, role: null, email: null });
  });

  it('shows the logged-out links and no logout button when nobody is signed in', () => {
    renderNav();

    expect(screen.getByText('Register as a Player')).toBeInTheDocument();
    expect(screen.getByText('Player Login')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
    // A player who isn't logged in shouldn't see admin-only links either.
    expect(screen.queryByText('Player Directory')).not.toBeInTheDocument();
  });

  it('shows My Profile and an avatar for a logged-in player, but no admin links', () => {
    useAuthStore.getState().login('fake-token', 'player', 'alex.doe@example.com');

    renderNav();

    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('AD')).toBeInTheDocument(); // initials from the email
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    expect(screen.queryByText('Player Directory')).not.toBeInTheDocument();
    expect(screen.queryByText('Register as a Player')).not.toBeInTheDocument();
  });

  it('shows Player Directory and Admin Dashboard for a logged-in admin', () => {
    useAuthStore.getState().login('fake-token', 'admin', 'owner@example.com');

    renderNav();

    expect(screen.getByText('Player Directory')).toBeInTheDocument();
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('My Profile')).not.toBeInTheDocument();
  });
});
