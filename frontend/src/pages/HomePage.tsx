import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Flex,
  Image,
} from '@chakra-ui/react';

// Placeholder — swap this for your agency's real inbox before going live.
// The contact form builds a mailto: link client-side (no backend involved).
const CONTACT_EMAIL = 'contact@yourfootballagency.com';

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

// Numbered step: a colored circle + title + one line. Used in "How it works".
function Step({
  n,
  color,
  title,
  body,
}: {
  n: number;
  color: string;
  title: string;
  body: string;
}) {
  return (
    <VStack spacing={3} textAlign="center" px={2}>
      <Flex
        align="center"
        justify="center"
        w={14}
        h={14}
        borderRadius="full"
        bg={color}
        color="white"
        fontSize="2xl"
        fontWeight="bold"
      >
        {n}
      </Flex>
      <Heading as="h3" size="md">
        {title}
      </Heading>
      <Text color="gray.600">{body}</Text>
    </VStack>
  );
}

// Service card: photo on top, colored accent underline, short copy.
function ServiceCard({
  image,
  accent,
  title,
  body,
}: {
  image: string;
  accent: string;
  title: string;
  body: string;
}) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.15s ease"
      _hover={{ transform: 'translateY(-4px)' }}
    >
      <Image src={image} alt="" h="150px" w="100%" objectFit="cover" />
      <Box p={5} borderBottom="4px solid" borderBottomColor={accent}>
        <Heading as="h3" size="sm" mb={2}>
          {title}
        </Heading>
        <Text fontSize="sm" color="gray.600">
          {body}
        </Text>
      </Box>
    </Box>
  );
}

export default function HomePage() {
  const [contact, setContact] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const updateField =
    (field: keyof ContactForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setContact((c) => ({ ...c, [field]: e.target.value }));

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Message from ${contact.firstName} ${contact.lastName}`.trim(),
    );
    const body = encodeURIComponent(
      `${contact.message}\n\n— ${contact.firstName} ${contact.lastName} (${contact.email})`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <Box>
      {/* Hero: one bold gradient, one headline, one button — the "less is
          more" pattern. Photos on the right only appear from md up. */}
      <Box
        bgGradient="linear(to-br, brand.700, brand.500 45%, sky.500)"
        color="white"
        overflow="hidden"
        position="relative"
      >
        <Container maxW="1000px" py={{ base: 14, md: 24 }}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            gap={{ base: 0, md: 12 }}
          >
            <Box flex={1} textAlign={{ base: 'center', md: 'left' }}>
              <Heading
                as="h1"
                size={{ base: 'xl', md: '2xl' }}
                lineHeight="1.1"
                mb={5}
              >
                Where football talent gets seen.
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'xl' }}
                color="whiteAlpha.900"
                mb={8}
                maxW="480px"
                mx={{ base: 'auto', md: 0 }}
              >
                Create your player profile, get reviewed by our team, and be
                found by clubs and scouts.
              </Text>
              <HStack
                spacing={3}
                justify={{ base: 'center', md: 'flex-start' }}
                wrap="wrap"
              >
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  bg="gold.500"
                  color="ink.500"
                  borderRadius="full"
                  px={8}
                  _hover={{ bg: 'gold.50' }}
                >
                  Register as a player
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  size="lg"
                  variant="outline"
                  color="white"
                  borderColor="whiteAlpha.700"
                  borderRadius="full"
                  px={8}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Log in
                </Button>
              </HStack>
            </Box>

            <Box
              flex={1}
              display={{ base: 'none', md: 'block' }}
              position="relative"
              h="340px"
            >
              <Image
                src="/images/services/full-player-support.avif"
                alt=""
                position="absolute"
                top={0}
                right={0}
                w="75%"
                h="200px"
                objectFit="cover"
                borderRadius="2xl"
                boxShadow="2xl"
                border="4px solid white"
              />
              <Image
                src="/images/services/career-advice.avif"
                alt=""
                position="absolute"
                bottom={0}
                left={0}
                w="65%"
                h="180px"
                objectFit="cover"
                borderRadius="2xl"
                boxShadow="2xl"
                border="4px solid white"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* How it works — three colored steps, nothing else. */}
      <Box bg="white" py={{ base: 12, md: 16 }}>
        <Container maxW="900px">
          <Heading as="h2" size="lg" textAlign="center" mb={10}>
            How it works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Step
              n={1}
              color="brand.500"
              title="Build your profile"
              body="Add your position, club, bio and a highlight video."
            />
            <Step
              n={2}
              color="gold.500"
              title="Get reviewed"
              body="Our team checks every profile before it goes live."
            />
            <Step
              n={3}
              color="sky.500"
              title="Get discovered"
              body="Approved players are visible to clubs and scouts."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* What we do — photo cards, one accent color per card. */}
      <Box bg="gold.50" py={{ base: 12, md: 16 }}>
        <Container maxW="1000px">
          <Heading as="h2" size="lg" textAlign="center" mb={10}>
            What we do
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
            <ServiceCard
              image="/images/services/full-player-support.avif"
              accent="brand.500"
              title="Full player support"
              body="Day-to-day mental and sporting support alongside every service."
            />
            <ServiceCard
              image="/images/services/trial-placements.avif"
              accent="gold.500"
              title="Trial placements"
              body="Your profile in front of clubs offering trial spots."
            />
            <ServiceCard
              image="/images/services/match-reporting.avif"
              accent="sky.500"
              title="Match reporting"
              body="Your performances, organized clearly for clubs."
            />
            <ServiceCard
              image="/images/services/contract-support.avif"
              accent="brand.500"
              title="Contract support"
              body="Presenting you to professional football organizations."
            />
            <ServiceCard
              image="/images/services/career-advice.avif"
              accent="gold.500"
              title="Career advice"
              body="Know your goal and the steps it takes to get there."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Big closing call-to-action, same gradient as the hero. */}
      <Box
        bgGradient="linear(to-r, sky.500, brand.500)"
        color="white"
        textAlign="center"
        py={{ base: 12, md: 16 }}
        px={4}
      >
        <Heading as="h2" size="lg" mb={3}>
          Ready for your next step?
        </Heading>
        <Text mb={6} color="whiteAlpha.900">
          Registration takes a few minutes and it's free.
        </Text>
        <Button
          as={RouterLink}
          to="/register"
          size="lg"
          bg="white"
          color="ink.500"
          borderRadius="full"
          px={10}
          _hover={{ bg: 'brand.50' }}
        >
          Get started
        </Button>
      </Box>

      <Box bg="sky.50" py={{ base: 12, md: 16 }}>
        <Container maxW="900px">
          <Heading as="h2" size="lg" textAlign="center" mb={8}>
            Contact
          </Heading>
          <Box
            as="form"
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p={{ base: 5, md: 8 }}
            maxW="480px"
            mx="auto"
            onSubmit={handleContactSubmit}
          >
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>First name</FormLabel>
                <Input value={contact.firstName} onChange={updateField('firstName')} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last name</FormLabel>
                <Input value={contact.lastName} onChange={updateField('lastName')} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={contact.email}
                  onChange={updateField('email')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea rows={4} value={contact.message} onChange={updateField('message')} />
              </FormControl>
              <Button type="submit" alignSelf="flex-start">
                Submit
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>

      <Box as="footer" bg="ink.500" color="white" textAlign="center" py={8} px={4}>
        <Text fontSize="sm" color="gray.400">
          &copy; {new Date().getFullYear()} Your Football Agency
        </Text>
      </Box>
    </Box>
  );
}
