import { Navigate } from 'react-router-dom';
import { getRole } from '../api';

interface Props {
  allowedRole: 'player' | 'admin';
  redirectTo: string;
  children: React.ReactNode;
}

// Wrap any route's element in this to require a specific role. It doesn't
// verify the token is genuinely valid (only the backend can do that — a
// browser can't check a signature it doesn't hold the secret for), it
// just checks "does localStorage say someone logged in as the right
// role?" and bounces them to the right login page if not. Real
// enforcement — the part that actually protects data — happens
// server-side in AdminAuthGuard / PlayerAuthGuard. This component is
// about user experience: don't show a page that's about to fail anyway.
export default function ProtectedRoute({ allowedRole, redirectTo, children }: Props) {
  const role = getRole();

  if (role !== allowedRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
