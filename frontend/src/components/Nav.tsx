import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Link as ChakraLink,
  Button,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';

function initialsFrom(email: string) {
  // Cheap, good-enough avatar: first letter of the email, plus the first
  // letter after a '.' or '_' if there is one (e.g. "alex.doe@x.com" -> AD).
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/).filter(Boolean);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return initials.toUpperCase();
}

// Nav reads from the Zustand store instead of localStorage directly. The
// difference matters: this component re-renders automatically the instant
// login()/logout() is called anywhere in the app, because it's subscribed
// to the store — it doesn't have to wait for some unrelated re-render to
// happen to "notice" the change, the way reading localStorage directly
// would.
export default function Nav() {
  const role = useAuthStore((s) => s.role);
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // isOpen only matters below the md breakpoint — the responsive display
  // props below make the link list ignore it entirely on wider screens.
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleLogout = () => {
    const wasAdmin = role === 'admin';
    logout();
    onClose();
    navigate(wasAdmin ? '/admin' : '/login');
  };

  return (
    <Box as="nav" bg="ink.500" color="white" px={{ base: 4, md: 5 }} py={3}>
      <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
        <ChakraLink as={RouterLink} to="/" onClick={onClose} aria-label="Home">
          <Flex
            align="center"
            justify="center"
            w="2.4rem"
            h="2.4rem"
            borderRadius="full"
            border="2px solid white"
            fontWeight="bold"
            fontSize="0.8rem"
          >
            PA
          </Flex>
        </ChakraLink>

        <IconButton
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={onToggle}
          display={{ base: 'inline-flex', md: 'none' }}
          variant="outline"
          colorScheme="whiteAlpha"
          size="sm"
          icon={<Box as="span">☰</Box>}
        />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          display={{ base: isOpen ? 'flex' : 'none', md: 'flex' }}
          gap={{ base: 3, md: 6 }}
          w={{ base: 'full', md: 'auto' }}
          flex={{ md: 1 }}
        >
          {role === null && (
            <>
              <ChakraLink as={RouterLink} to="/register" onClick={onClose}>
                Register as a Player
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/login" onClick={onClose}>
                Player Login
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/admin" onClick={onClose}>
                Admin
              </ChakraLink>
            </>
          )}

          {role === 'player' && (
            <ChakraLink as={RouterLink} to="/profile" onClick={onClose}>
              My Profile
            </ChakraLink>
          )}

          {role === 'admin' && (
            <>
              <ChakraLink as={RouterLink} to="/players" onClick={onClose}>
                Player Directory
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/admin/dashboard" onClick={onClose}>
                Admin Dashboard
              </ChakraLink>
            </>
          )}

          {role !== null && (
            <Flex
              align="center"
              gap={3}
              ml={{ md: 'auto' }}
              w={{ base: 'full', md: 'auto' }}
              justify={{ base: 'space-between', md: 'flex-start' }}
            >
              {email && (
                <Flex
                  align="center"
                  justify="center"
                  w="1.8rem"
                  h="1.8rem"
                  borderRadius="full"
                  bg="brand.500"
                  color="white"
                  fontSize="0.75rem"
                  fontWeight="bold"
                  title={email}
                  flexShrink={0}
                >
                  {initialsFrom(email)}
                </Flex>
              )}
              <Button
                size="sm"
                variant="outline"
                colorScheme="whiteAlpha"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
