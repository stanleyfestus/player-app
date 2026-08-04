import { extendTheme } from '@chakra-ui/react';

// A Chakra "theme token" is just a named value (color, spacing, etc.) you
// can reference anywhere as e.g. bg="brand.600" instead of a raw hex code.
// brand.600 is the one used for primary buttons/links by convention.
const theme = extendTheme({
  colors: {
    brand: {
      50: '#eaf7ee',
      500: '#1f7a3d',
      600: '#1f7a3d',
      700: '#14532d',
    },
    gold: {
      50: '#fdf3e0',
      500: '#e0a030',
    },
    sky: {
      50: '#eaf4fb',
      500: '#2b7fb8',
    },
    ink: {
      500: '#111111',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#f7f7f8',
        color: '#1a1a1a',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

export default theme;
