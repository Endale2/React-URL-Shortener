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
    <Box>
      <FormControl id="url">
        <FormLabel>Enter your URL</FormLabel>
        <Input
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </FormControl>
      <Button mt={4} colorScheme="teal" isLoading={loading} onClick={handleSubmit}>
        Shorten URL
      </Button>

      {shortUrl && (
        <Box mt={4}>
          <Text>Your short URL:</Text>
          <Link href={shortUrl} color="teal.500">
            {shortUrl}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default URLForm;
