import { useEffect, useState } from 'react';
import { api } from '../api';

interface Player {
  id: string;
  fullName: string;
  position: string;
  age?: number;
  club?: string;
  bio?: string;
  videoUrl?: string;
  status: string;
}

// Admin-only page now: this calls the admin-authenticated endpoint and
// shows every player regardless of status, not just approved ones. The
// route this is mounted on is wrapped in <ProtectedRoute allowedRole="admin">
// in App.tsx, and the backend's AdminAuthGuard enforces it independently
// of whatever the frontend does.
export default function DirectoryPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .adminListPlayers()
      .then(setPlayers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading players…</p>;
  if (!players.length) return <p>No player profiles yet.</p>;

  return (
    <div>
      <h1>Player Directory</h1>
      <div className="grid">
        {players.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.fullName}</h3>
            <p>
              {p.position}
              {p.age ? `, ${p.age} yrs` : ''}
            </p>
            <p>
              <em>{p.status}</em>
            </p>
            {p.club && <p>{p.club}</p>}
            {p.bio && <p>{p.bio}</p>}
            {p.videoUrl && (
              <a href={p.videoUrl} target="_blank" rel="noreferrer">
                Watch highlights
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
