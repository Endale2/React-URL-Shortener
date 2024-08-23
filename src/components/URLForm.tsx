import React, { useState, FormEvent } from 'react';
import { Button, Input, Box, FormControl, FormLabel, Text, Link } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';

interface URLFormProps {
  onShortened: (shortCode: string) => void;
}

const URLForm: React.FC<URLFormProps> = ({ onShortened }) => {
  const [longUrl, setLongUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const generateShortCode = (): string => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if the URL already exists
    let { data: existingUrls, error: selectError } = await supabase
      .from('urls')
      .select('short_code')
      .eq('original_url', longUrl)
      .limit(1);

    if (selectError) {
      console.error('Error checking for existing URL:', selectError.message);
    }

    if (existingUrls && existingUrls.length > 0) {
      // URL already exists, use the existing short code
      const existingShortCode = existingUrls[0].short_code;
      setShortUrl(`${window.location.origin}/${existingShortCode}`);
      onShortened(existingShortCode);
    } else {
      // Insert a new URL
      const shortCode = generateShortCode();
      const { error: insertError } = await supabase
        .from('urls')
        .insert([{ original_url: longUrl, short_code: shortCode }]);

      if (insertError) {
        console.error('Error creating short URL:', insertError.message);
      } else {
        const generatedShortUrl = `${window.location.origin}/${shortCode}`;
        setShortUrl(generatedShortUrl);
        onShortened(shortCode);
        setLongUrl('');
      }
    }

    setLoading(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width="100vw"
      bg="teal.500"
      p={4}
      overflowX="hidden"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        shadow="xl"
        width={{ base: '90%', sm: '70%', md: '50%' }}
        maxW="500px"
        transition="transform 0.3s ease-in-out"
        _hover={{ transform: 'scale(1.03)' }}
        textAlign="center"
      >
        <FormControl id="url">
          <FormLabel fontSize="lg" fontWeight="bold" mb={2}>Enter your URL</FormLabel>
          <Input
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com"
            variant="outline"
            mb={8}
            size="lg"
          />
        </FormControl>
        <Button
          colorScheme="teal"
          isLoading={loading}
          onClick={handleSubmit}
          width="full"
          size="lg"
          mb={8}
          _hover={{ bg: 'teal.600' }}
        >
          Shorten URL
        </Button>

        {shortUrl && (
          <Box mt={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>Your short URL:</Text>
            <Link href={shortUrl} color="teal.500" isExternal fontSize="lg">
              {shortUrl}
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default URLForm;
