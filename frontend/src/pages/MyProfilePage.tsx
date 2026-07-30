import { useEffect, useState } from 'react';
import { api } from '../api';

interface Player {
  id: string;
  fullName: string;
  email: string;
  position: string;
  age?: number;
  club?: string;
  bio?: string;
  videoUrl?: string;
  status: string;
}

const statusMessage: Record<string, string> = {
  PENDING: 'Your profile is still waiting for review.',
  APPROVED: 'Your profile is live in the public directory.',
  REJECTED: 'Your profile was not approved.',
};

export default function MyProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMyProfile()
      .then(setPlayer)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading your profile…</p>;
  if (!player) return <p>Could not load your profile.</p>;

  return (
    <div>
      <h1>My Profile</h1>
      <p>
        <strong>Status:</strong> {player.status} —{' '}
        {statusMessage[player.status] ?? ''}
      </p>
      <p>
        <strong>Name:</strong> {player.fullName}
      </p>
      <p>
        <strong>Position:</strong> {player.position}
        {player.age ? `, ${player.age} yrs` : ''}
      </p>
      {player.club && (
        <p>
          <strong>Club:</strong> {player.club}
        </p>
      )}
      {player.bio && <p>{player.bio}</p>}
      {player.videoUrl && (
        <p>
          <a href={player.videoUrl} target="_blank" rel="noreferrer">
            Highlight video
          </a>
        </p>
      )}
    </div>
  );
}
