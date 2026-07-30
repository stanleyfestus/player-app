import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './HomePage';

// The simplest possible test: render the component and check that
// something we expect to see is actually on the page. This is a good
// first test for any component — it mostly catches "it crashes" and
// "I deleted the heading by accident" kinds of mistakes.
describe('HomePage', () => {
  it('renders the agency heading', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { name: /your football agency/i }),
    ).toBeInTheDocument();
  });
});
