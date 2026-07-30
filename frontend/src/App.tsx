import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DirectoryPage from './pages/DirectoryPage';
import PlayerLoginPage from './pages/PlayerLoginPage';
import MyProfilePage from './pages/MyProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Nav from './components/Nav';

export default function App() {
  return (
    <div>
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Player login redirects to /profile on success (see
              PlayerLoginPage). /profile itself is guarded below: anyone
              who isn't logged in as a player gets bounced back here. */}
          <Route path="/login" element={<PlayerLoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="player" redirectTo="/login">
                <MyProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin login redirects to /admin/dashboard on success.
              Both /players (the directory) and /admin/dashboard require
              an admin session — the backend enforces this independently
              via AdminAuthGuard, this is just so the frontend doesn't
              show a page that's about to fail anyway. */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route
            path="/players"
            element={
              <ProtectedRoute allowedRole="admin" redirectTo="/admin">
                <DirectoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin" redirectTo="/admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
