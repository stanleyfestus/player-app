import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RegisterPage from './RegisterPage';
import { api } from '../api';

// We don't want this test to make a real network request to a backend
// that may not even be running. vi.mock replaces the whole '../api'
// module with a fake version for this test file only — everywhere
// RegisterPage imports `api`, it gets our fake instead.
vi.mock('../api', () => ({
  api: {
    registerPlayer: vi.fn(),
  },
}));

describe('RegisterPage', () => {
  it('submits the form with the values the player typed in', async () => {
    // Arrange
    const user = userEvent.setup();
    (api.registerPlayer as ReturnType<typeof vi.fn>).mockResolvedValue({});
    render(<RegisterPage />);

    // Act: fill in the form the same way a real player would — by typing
    // into the fields and clicking the button. Testing Library
    // deliberately makes you interact through what's visible on screen
    // (labels, buttons) rather than reaching into internal React state,
    // so the test proves the actual user experience works. The password
    // field is now required (min 8 characters) — the browser itself
    // (jsdom, here) blocks submission of an invalid form, so the test has
    // to fill it in just like a real player would.
    await user.type(screen.getByLabelText(/full name/i), 'Alex Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'alex@example.com');
    await user.type(screen.getByLabelText(/password/i), 'a-strong-password');
    await user.type(screen.getByLabelText(/position/i), 'Striker');
    await user.click(screen.getByRole('button', { name: /submit profile/i }));

    // Assert: the form called the API with what was typed in.
    expect(api.registerPlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Alex Doe',
        email: 'alex@example.com',
        password: 'a-strong-password',
        position: 'Striker',
      }),
    );

    // And the success message replaces the form.
    expect(await screen.findByText(/pending review/i)).toBeInTheDocument();
  });

  it('does not submit when the password is too short', async () => {
    // This is the "unhappy path" for a form: the HTML5 minLength=8
    // constraint should stop submission before our code ever calls the
    // API. If someone later removes that validation by accident, this
    // test catches it.
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), 'Alex Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'alex@example.com');
    await user.type(screen.getByLabelText(/password/i), 'short');
    await user.type(screen.getByLabelText(/position/i), 'Striker');
    await user.click(screen.getByRole('button', { name: /submit profile/i }));

    expect(api.registerPlayer).not.toHaveBeenCalled();
  });
});
