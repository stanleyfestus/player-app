import { Link, useNavigate } from 'react-router-dom';
import { clearSession, getEmail, getRole } from '../api';

function initialsFrom(email: string) {
  // Cheap, good-enough avatar: first letter of the email, plus the first
  // letter after a '.' or '_' if there is one (e.g. "alex.doe@x.com" -> AD).
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/).filter(Boolean);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return initials.toUpperCase();
}

// The nav reads localStorage directly on every render rather than holding
// its own state. That's fine here because a full page navigation (or at
// least a route change) always happens right after login/logout, which
// re-renders this component anyway — we don't need it to react to changes
// happening in some *other* tab.
export default function Nav() {
  const role = getRole();
  const email = getEmail();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate(role === 'admin' ? '/admin' : '/login');
  };

  return (
    <nav className="nav">
      <Link to="/">Home</Link>

      {role === null && (
        <>
          <Link to="/register">Register as a Player</Link>
          <Link to="/login">Player Login</Link>
          <Link to="/admin">Admin</Link>
        </>
      )}

      {role === 'player' && <Link to="/profile">My Profile</Link>}

      {role === 'admin' && (
        <>
          <Link to="/players">Player Directory</Link>
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        </>
      )}

      {role !== null && (
        <span className="nav-account">
          {email && <span className="avatar" title={email}>{initialsFrom(email)}</span>}
          <button onClick={handleLogout}>Log out</button>
        </span>
      )}
    </nav>
  );
}
