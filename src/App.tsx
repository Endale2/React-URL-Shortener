import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import URLForm from './components/URLForm';
import ShortenedURL from './components/shortenedURL';
import { supabase } from './supabaseClient';

const Redirect = () => {
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
      } else {
        console.error('Error fetching URL:', error?.message || 'No matching URL found');
      }
    };

    fetchOriginalUrl();
  }, [shortCode]);

  return <div>Redirecting...</div>;
};

const App = () => {
  const [shortCode, setShortCode] = useState<string>('');

  const handleShortened = (code: string) => {
    setShortCode(code);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLForm onShortened={handleShortened} />} />
        <Route path="/shortened" element={<ShortenedURL shortCode={shortCode} />} />
        <Route path="/:shortCode" element={<Redirect />} />
      </Routes>
    </Router>
  );
};

export default App;
