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
  Flex,
  Image,
} from '@chakra-ui/react';

// Placeholder — swap this for your agency's real inbox before going live.
// The contact form below builds a mailto: link client-side, so there's no
// backend involved; whatever address is here is where messages will open.
const CONTACT_EMAIL = 'contact@yourfootballagency.com';

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

// Small reusable card for the "How it works" / "What we do" grids. The top
// border color is passed in so each section's cards can pick up an accent
// that matches that section's background band. `image` is optional — the
// "How it works" cards don't have one, the "What we do" cards do.
function InfoCard({
  title,
  body,
  accent = 'brand.500',
  image,
}: {
  title: string;
  body: string;
  accent?: string;
  image?: string;
}) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderTop="3px solid"
      borderTopColor={accent}
      borderRadius="md"
      overflow="hidden"
      textAlign="center"
    >
      {image && (
        <Image src={image} alt="" h="140px" w="100%" objectFit="cover" />
      )}
      <Box p={5}>
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
      {/* Hero — full viewport width. This page is deliberately NOT wrapped
          in the app's PageContainer (see App.tsx), so there's no ancestor
          padding to fight with here; that mismatch was the root cause of
          the old mobile-centering bug. */}
      <Box
        position="relative"
        overflow="hidden"
        textAlign="center"
        color="white"
        px={{ base: 4, md: 6 }}
        py={{ base: 10, md: 20 }}
        // Plain `style` here on purpose: Chakra's `backgroundImage` prop
        // tries to parse gradient strings looking for theme color tokens
        // (e.g. "brand.500") and chokes on a raw multi-layer
        // gradient+url() background like this one. `style` skips that
        // parsing entirely and is passed straight to the DOM.
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,20,10,0.6), rgba(8,20,10,0.8)), url('/images/pitch-texture.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Decorative ball graphic, drawn in SVG rather than a stock photo
            so it renders crisply at any size with no external asset. */}
        <Box
          as="svg"
          position="absolute"
          right="-2.5rem"
          bottom="-3.5rem"
          w={{ base: '120px', md: '180px' }}
          h={{ base: '120px', md: '180px' }}
          opacity={0.16}
          pointerEvents="none"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="96" fill="#fff" stroke="#111" strokeWidth={4} />
          <polygon points="100,60 122,76 114,102 86,102 78,76" fill="#111" />
          <polygon points="100,60 78,76 55,68 60,40 100,30" fill="none" stroke="#111" strokeWidth={4} />
          <polygon points="100,60 122,76 145,68 140,40 100,30" fill="none" stroke="#111" strokeWidth={4} />
          <polygon points="78,76 55,68 40,95 60,118 86,102" fill="none" stroke="#111" strokeWidth={4} />
          <polygon points="122,76 145,68 160,95 140,118 114,102" fill="none" stroke="#111" strokeWidth={4} />
          <polygon points="86,102 60,118 70,150 100,160 100,130" fill="none" stroke="#111" strokeWidth={4} />
          <polygon points="114,102 140,118 130,150 100,160 100,130" fill="none" stroke="#111" strokeWidth={4} />
        </Box>

        <Container maxW="640px" position="relative" p={0}>
          <Heading as="h1" size={{ base: 'lg', md: 'xl' }} mb={4} lineHeight="1.25">
            Talent brought you here. Guidance takes you further.
          </Heading>
          <Text mb={7} fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.900">
            We help young football talents get seen. Build your profile, get
            reviewed by our team, and get listed where clubs and scouts are
            looking.
          </Text>
          <Button
            as={RouterLink}
            to="/register"
            bg="white"
            color="ink.500"
            borderRadius="full"
            px={8}
            py={6}
            fontWeight="bold"
            _hover={{ bg: 'brand.50' }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Stat band — also full width, sits directly under the hero. */}
      <Box bg="ink.500" color="white" py={4}>
        <Flex
          maxW="640px"
          mx="auto"
          align="center"
          justify="center"
          gap={3}
          textAlign="center"
          direction={{ base: 'column', md: 'row' }}
          px={4}
        >
          <Text as="span" fontSize="xl" aria-hidden="true">
            ⚽
          </Text>
          <Text color="gray.300" fontSize="sm">
            From first touch to first contract — we're with you every step.
          </Text>
        </Flex>
      </Box>

      {/* From here down, each section is its own full-width color band
          (same pattern as the hero/stat-band above: a full-width Box with
          an inner Container for the centered, max-width content) instead
          of one shared gray Container — that's what gives the page its
          alternating color rhythm. */}
      <Box bg="brand.50" py={10}>
        <Container maxW="900px">
          <Heading as="h2" size="md" textAlign="center" mb={6}>
            About us
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} alignItems="center">
            <VStack align="stretch" spacing={4}>
              <Text color="gray.700" lineHeight="1.6">
                We're built around one idea: every player deserves someone
                looking out for their career, not just their next match.
                From registration to representation, we handle the details
                so you can focus on your game.
              </Text>
              <Text color="gray.700" lineHeight="1.6">
                We believe footballers need trusted, professional guidance
                from an early age — long before the big decisions land on
                their desk.
              </Text>
            </VStack>
            <Box
              as="blockquote"
              bg="white"
              borderLeft="4px solid"
              borderLeftColor="gold.500"
              borderRadius="md"
              p={6}
              fontSize="lg"
              fontStyle="italic"
              color="gray.800"
            >
              “Our players' success is our best introduction.”
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Box bg="white" py={10}>
        <Container maxW="900px">
          <Heading as="h2" size="md" textAlign="center" mb={6}>
            How it works
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={5}>
            <InfoCard
              accent="brand.500"
              title="Build your profile"
              body="Share your position, club history, and highlight video in minutes."
            />
            <InfoCard
              accent="brand.500"
              title="Get reviewed"
              body="Our team checks every profile before it goes into the directory."
            />
            <InfoCard
              accent="brand.500"
              title="Get discovered"
              body="Approved profiles are visible to the clubs and scouts we work with."
            />
          </SimpleGrid>
        </Container>
      </Box>

      <Box bg="gold.50" py={10}>
        <Container maxW="900px">
          <Heading as="h2" size="md" textAlign="center" mb={6}>
            What we do
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={5}>
            <InfoCard
              accent="gold.500"
              image="/images/services/full-player-support.avif"
              title="Full player support"
              body="The complete package — day-to-day mental and sporting support alongside every other service."
            />
            <InfoCard
              accent="gold.500"
              image="/images/services/trial-placements.avif"
              title="Trial placements"
              body="Putting your profile in front of clubs and organizations offering trial spots."
            />
            <InfoCard
              accent="gold.500"
              image="/images/services/match-reporting.avif"
              title="Match reporting"
              body="Your performances, organized clearly for communication with clubs."
            />
            <InfoCard
              accent="gold.500"
              image="/images/services/contract-support.avif"
              title="Contract support"
              body="Presenting your profile to professional football organizations."
            />
            <InfoCard
              accent="gold.500"
              image="/images/services/career-advice.avif"
              title="Career advice"
              body="Know your goal, and know the steps it takes to get there."
            />
          </SimpleGrid>
        </Container>
      </Box>

      <Box bg="sky.50" py={10}>
        <Container maxW="900px">
          <Heading as="h2" size="md" textAlign="center" mb={6}>
            Contact
          </Heading>
          <Box
            as="form"
            bg="white"
            borderRadius="md"
            p={{ base: 5, md: 8 }}
            maxW="480px"
            mx="auto"
            onSubmit={handleContactSubmit}
          >
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>First name</FormLabel>
                <Input
                  value={contact.firstName}
                  onChange={updateField('firstName')}
                />
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

      {/* Footer — full width again, same reasoning as the hero. */}
      <Box as="footer" bg="ink.500" color="white" textAlign="center" py={10} px={4}>
        <Flex
          align="center"
          justify="center"
          w="2.4rem"
          h="2.4rem"
          borderRadius="full"
          border="2px solid white"
          fontWeight="bold"
          fontSize="0.8rem"
          mx="auto"
          mb={3}
        >
          PA
        </Flex>
        <Text fontSize="lg" mb={2}>
          Your next step starts here.
        </Text>
        <Text fontSize="xs" color="gray.500">
          &copy; {new Date().getFullYear()} Your Football Agency
        </Text>
      </Box>
    </Box>
  );
}
