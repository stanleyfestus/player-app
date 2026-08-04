import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DirectoryPage from './pages/DirectoryPage';
import PlayerLoginPage from './pages/PlayerLoginPage';
import MyProfilePage from './pages/MyProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import PageContainer from './components/PageContainer';
import Nav from './components/Nav';

export default function App() {
  return (
    <div>
      <Nav />
      <main>
        <Routes>
          {/* Home is the one page NOT wrapped in PageContainer — its hero
              sections need to span the full viewport width. */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/register"
            element={
              <PageContainer>
                <RegisterPage />
              </PageContainer>
            }
          />

          {/* Player login redirects to /profile on success (see
              PlayerLoginPage). /profile itself is guarded below: anyone
              who isn't logged in as a player gets bounced back here. */}
          <Route
            path="/login"
            element={
              <PageContainer>
                <PlayerLoginPage />
              </PageContainer>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="player" redirectTo="/login">
                <PageContainer>
                  <MyProfilePage />
                </PageContainer>
              </ProtectedRoute>
            }
          />

          {/* Admin login redirects to /admin/dashboard on success.
              Both /players (the directory) and /admin/dashboard require
              an admin session — the backend enforces this independently
              via AdminAuthGuard, this is just so the frontend doesn't
              show a page that's about to fail anyway. */}
          <Route
            path="/admin"
            element={
              <PageContainer>
                <AdminLoginPage />
              </PageContainer>
            }
          />
          <Route
            path="/players"
            element={
              <ProtectedRoute allowedRole="admin" redirectTo="/admin">
                <PageContainer>
                  <DirectoryPage />
                </PageContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin" redirectTo="/admin">
                <PageContainer>
                  <AdminDashboardPage />
                </PageContainer>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
