import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import type { PlayerStatus } from '../types';

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminDashboardPage() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const queryClient = useQueryClient();

  // 'ALL' isn't a real status in the database — it just means "don't
  // filter," so we pass undefined to the API in that case instead of the
  // literal string. The filter is part of the query key so switching tabs
  // is its own cached query, not a manual refetch.
  const { data: players, isLoading } = useQuery({
    queryKey: ['admin-players', filter],
    queryFn: () =>
      api.adminListPlayers(filter === 'ALL' ? undefined : (filter as PlayerStatus)),
  });

  // useMutation is for the "changing something" half of TanStack Query
  // (as opposed to useQuery, which is for "fetching something"). Its
  // onSuccess here tells the cache "any query tagged 'admin-players' is
  // now stale, go refetch it" — which is what makes the table refresh
  // after an approve/reject, without us manually calling load() again.
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PlayerStatus }) =>
      api.adminUpdateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
    },
  });

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="filters">
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={filter === s ? 'active' : ''}
          >
            {s}
          </button>
        ))}
      </div>
      {isLoading ? (
        <p>Loading…</p>
      ) : !players?.length ? (
        <p>No profiles in this category.</p>
      ) : (
        <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td>{p.fullName}</td>
                <td>{p.position}</td>
                <td>{p.email}</td>
                <td>{p.status}</td>
                <td>
                  {p.status !== 'APPROVED' && (
                    <button
                      className="approve-btn"
                      onClick={() => updateStatus.mutate({ id: p.id, status: 'APPROVED' })}
                    >
                      Approve
                    </button>
                  )}
                  {p.status !== 'REJECTED' && (
                    <button
                      className="reject-btn"
                      onClick={() => updateStatus.mutate({ id: p.id, status: 'REJECTED' })}
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
