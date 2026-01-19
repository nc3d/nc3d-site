import React, { useState, useMemo } from 'react';
import Slideshow from '../components/Slideshow';
import CompanyStatement from '../components/CompanyStatement';
import WordCloud from '../components/WordCloud';
import { slideshowImages } from '../utils/slideshowHelper';

const HomePage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredImages = useMemo(() => {
    if (!selectedTag) return slideshowImages;
    return slideshowImages.filter((img) => img.tags?.includes(selectedTag));
  }, [selectedTag]);

  return (
    <>
      {/* 1. Slideshow (with internal caption overlay) */}
      <Slideshow images={filteredImages} />
      
      {/* 2. WordCloud (now with background style) */}
      <WordCloud 
        images={slideshowImages} 
        selectedTag={selectedTag} 
        onSelectTag={setSelectedTag} 
      />
      
      {/* 3. Company Statement */}
      <CompanyStatement />
    </>
  );
};

export default HomePage;