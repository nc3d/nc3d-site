import React, { useState, useMemo } from 'react';
import Slideshow from '../components/Slideshow';
import WordCloud from '../components/WordCloud'; 
import CompanyStatement from '../components/CompanyStatement';
import { slideshowImages } from '../utils/slideshowHelper';

const HomePage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredAndShuffledImages = useMemo(() => {
    let result = selectedTag 
      ? slideshowImages.filter(slide => slide.tags?.includes(selectedTag))
      : [...slideshowImages];

    // Old School Fisher-Yates Shuffle
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, [selectedTag]);

  return (
    /* Changed bg-black to your specific gray bg-[#565656] */
    <div className="bg-[#565656] min-h-screen w-full flex flex-col">
      <Slideshow images={filteredAndShuffledImages} />
      
      <div className="bg-[#565656] w-full overflow-hidden">
        <WordCloud 
          images={slideshowImages} 
          selectedTag={selectedTag} 
          onSelectTag={setSelectedTag} 
        />
      </div>
      
      <div className="bg-[#565656] w-full">
        <CompanyStatement />
      </div>
    </div>
  );
};

export default HomePage;