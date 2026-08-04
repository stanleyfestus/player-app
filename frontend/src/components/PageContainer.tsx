import { Container } from '@chakra-ui/react';
import type { ReactNode } from 'react';

// The centered, max-width, padded wrapper every page except Home uses.
// Home is deliberately left out of this — its hero/stat-band/footer need
// to span the full viewport width, and nesting them inside a padded
// container is what caused the old full-bleed CSS hack to miscenter on
// mobile (the "50vw" math assumed no ancestor padding, but there was some).
export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <Container maxW="900px" py={8}>
      {children}
    </Container>
  );
}
