import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import URLForm from './components/URLForm';
import ShortenedURL from './components/shortenedURL';
import { supabase } from './supabaseClient';

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      const { data, error } = await supabase
        .from('urls')
        .select('original_url')
        .eq('short_code', shortCode)
        .single();

      if (data) {
        window.location.href = data.original_url;
      } else if (error) {
        console.error('Error fetching URL:', error.message);
      }
    };

    fetchOriginalUrl();
  }, [shortCode]);

  return null;
};

const App: React.FC = () => {
  const [shortCode, setShortCode] = useState<string>('');

  const handleShortened = (code: string) => {
    setShortCode(code);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLForm onShortened={handleShortened} />} />
        <Route path="/:shortCode" element={<Redirect />} />
        <Route path="/shortened" element={<ShortenedURL shortCode={shortCode} />} />
      </Routes>
    </Router>
  );
};

export default App;
