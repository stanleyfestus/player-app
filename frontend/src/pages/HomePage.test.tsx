import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import HomePage from './HomePage';

// The simplest possible test: render the component and check that
// something we expect to see is actually on the page. This is a good
// first test for any component — it mostly catches "it crashes" and
// "I deleted the heading by accident" kinds of mistakes.
//
// HomePage's "Get Started" button renders as a react-router <Link>
// under the hood (via Chakra's `as={RouterLink}`), so it needs a Router
// in the tree the same way any page using <Link> does — without one,
// React Router throws instead of rendering.
describe('HomePage', () => {
  it('renders the hero heading', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', {
        name: /talent brought you here/i,
      }),
    ).toBeInTheDocument();
  });
});
