import { useEffect, useState } from 'react';
import { api } from '../api';

interface Player {
  id: string;
  fullName: string;
  email: string;
  position: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .adminListPlayers(filter)
      .then(setPlayers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await api.adminUpdateStatus(id, status);
    load();
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="filters">
        {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={filter === s ? 'active' : ''}
          >
            {s}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : !players.length ? (
        <p>No profiles in this category.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td>{p.fullName}</td>
                <td>{p.position}</td>
                <td>{p.email}</td>
                <td>
                  {p.status !== 'APPROVED' && (
                    <button onClick={() => updateStatus(p.id, 'APPROVED')}>
                      Approve
                    </button>
                  )}
                  {p.status !== 'REJECTED' && (
                    <button onClick={() => updateStatus(p.id, 'REJECTED')}>
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
