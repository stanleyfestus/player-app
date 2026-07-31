import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

const statusMessage: Record<string, string> = {
  PENDING: 'Your profile is still waiting for review.',
  APPROVED: 'Your profile is live in the public directory.',
  REJECTED: 'Your profile was not approved.',
};

export default function MyProfilePage() {
  // useQuery replaces the old useState+useEffect+loading dance: give it a
  // cache key ('my-profile') and a function that fetches the data, and it
  // tracks loading/error/data for you, plus caches the result so
  // navigating away and back doesn't necessarily re-fetch immediately.
  const { data: player, isLoading, isError } = useQuery({
    queryKey: ['my-profile'],
    queryFn: api.getMyProfile,
  });

  if (isLoading) return <p>Loading your profile…</p>;
  if (isError || !player) return <p>Could not load your profile.</p>;

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
