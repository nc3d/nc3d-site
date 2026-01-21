import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slideshow from '../components/Slideshow';
import WordCloud from '../components/WordCloud'; 
import CompanyStatement from '../components/CompanyStatement';
import Footer from '../components/Footer'; // Ensure Footer is imported
import { slideshowImages } from '../utils/slideshowHelper';

const HomePage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>(); 
  const navigate = useNavigate();

  const filteredAndShuffledImages = useMemo(() => {
    // 1. Case-insensitive Filtering
    let result = tag 
      ? slideshowImages.filter(slide => 
          slide.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
        )
      : [...slideshowImages];

    // 2. "Old School" Fisher-Yates Shuffle
    const shuffled = [...result];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [tag]);

  const handleSelectTag = (newTag: string | null) => {
    if (newTag) {
      // Navigate to lowercase URL to keep nc3d.com/bridges clean
      navigate(`/${newTag.toLowerCase()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#565656] min-h-screen w-full flex flex-col">
      <Slideshow images={filteredAndShuffledImages} />
      
      <div className="bg-[#565656] w-full overflow-hidden">
        <WordCloud 
          images={slideshowImages} 
          selectedTag={tag || null} 
          onSelectTag={handleSelectTag} 
        />
      </div>
      
      <CompanyStatement />

    </div>
  );
};

export default HomePage;