import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';

interface ShortenedURLProps {
  shortCode: string;
}

const ShortenedURL: React.FC<ShortenedURLProps> = ({ shortCode }) => {
  const shortUrl = `${window.location.origin}/${shortCode}`;

  return (
    <Box mt={4}>
      <Text>Your short URL:</Text>
      <Link href={shortUrl} color="teal.500">
        {shortUrl}
      </Link>
    </Box>
  );
};

export default ShortenedURL;
