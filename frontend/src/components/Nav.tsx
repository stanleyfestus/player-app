import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function initialsFrom(email: string) {
  // Cheap, good-enough avatar: first letter of the email, plus the first
  // letter after a '.' or '_' if there is one (e.g. "alex.doe@x.com" -> AD).
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/).filter(Boolean);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return initials.toUpperCase();
}

// Nav now reads from the Zustand store instead of localStorage directly.
// The difference matters: this component re-renders automatically the
// instant login()/logout() is called anywhere in the app, because it's
// subscribed to the store — it doesn't have to wait for some unrelated
// re-render to happen to "notice" the change, the way reading
// localStorage directly would.
export default function Nav() {
  const role = useAuthStore((s) => s.role);
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // Only used on narrow screens — the CSS hides the toggle button (and
  // ignores this state) above the phone breakpoint, so it has no effect
  // on desktop.
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    const wasAdmin = role === 'admin';
    logout();
    closeMenu();
    navigate(wasAdmin ? '/admin' : '/login');
  };

  return (
    <nav className="nav">
      <div className="nav-bar">
        <Link to="/" onClick={closeMenu}>Home</Link>
        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      <div className={`nav-links${open ? ' open' : ''}`}>
        {role === null && (
          <>
            <Link to="/register" onClick={closeMenu}>Register as a Player</Link>
            <Link to="/login" onClick={closeMenu}>Player Login</Link>
            <Link to="/admin" onClick={closeMenu}>Admin</Link>
          </>
        )}

        {role === 'player' && (
          <Link to="/profile" onClick={closeMenu}>My Profile</Link>
        )}

        {role === 'admin' && (
          <>
            <Link to="/players" onClick={closeMenu}>Player Directory</Link>
            <Link to="/admin/dashboard" onClick={closeMenu}>Admin Dashboard</Link>
          </>
        )}

        {role !== null && (
          <span className="nav-account">
            {email && <span className="avatar" title={email}>{initialsFrom(email)}</span>}
            <button onClick={handleLogout}>Log out</button>
          </span>
        )}
      </div>
    </nav>
  );
}
