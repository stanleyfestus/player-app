import { useState } from 'react';
import { api } from '../api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    position: '',
    age: '',
    club: '',
    bio: '',
    videoUrl: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>(
    'idle',
  );
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      await api.registerPlayer({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (status === 'done') {
    return (
      <p>
        Thanks! Your profile was submitted and is pending review. You can log
        in any time at <a href="/login">/login</a> to check its status.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h1>Player Registration</h1>
      <label>
        Full name
        <input name="fullName" required onChange={handleChange} />
      </label>
      <label>
        Email
        <input name="email" type="email" required onChange={handleChange} />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          onChange={handleChange}
        />
      </label>
      <label>
        Position
        <input name="position" required onChange={handleChange} />
      </label>
      <label>
        Age
        <input name="age" type="number" onChange={handleChange} />
      </label>
      <label>
        Current club (optional)
        <input name="club" onChange={handleChange} />
      </label>
      <label>
        Short bio
        <textarea name="bio" onChange={handleChange} />
      </label>
      <label>
        Highlight video URL
        <input name="videoUrl" onChange={handleChange} />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit profile'}
      </button>
    </form>
  );
}
