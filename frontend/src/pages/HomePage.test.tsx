import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, it, expect } from 'vitest';
import HomePage from './HomePage';
import theme from '../theme';

// HomePage needs two providers to render, same as in the real app:
// a Router (its buttons are react-router links) and ChakraProvider with
// our theme (gradients like "brand.500" are resolved from theme tokens —
// without the theme, Chakra can't look them up and throws).
describe('HomePage', () => {
  it('renders the hero heading', () => {
    render(
      <ChakraProvider theme={theme}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </ChakraProvider>,
    );
    expect(
      screen.getByRole('heading', { name: /football talent gets seen/i }),
    ).toBeInTheDocument();
  });
});
