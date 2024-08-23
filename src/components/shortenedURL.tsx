import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';

interface ShortenedURLProps {
  shortCode: string;
}

const ShortenedURL: React.FC<ShortenedURLProps> = ({ shortCode }) => {
  const shortUrl = `${window.location.origin}/${shortCode}`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={6}
      mt={4}
      bg="white"
      borderRadius="md"
      shadow="md"
      width="100vh"
      maxW="500px"
      transition="transform 0.3s ease-in-out"
      _hover={{ transform: 'scale(1.03)' }}
      textAlign="center"
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Your short URL:
      </Text>
      <Link href={shortUrl} color="teal.500" isExternal fontSize="lg">
        {shortUrl}
      </Link>
    </Box>
  );
};

export default ShortenedURL;
