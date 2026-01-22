import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slideshow from '../components/Slideshow';
import WordCloud from '../components/WordCloud'; 
import CompanyStatement from '../components/CompanyStatement';
import { slideshowImages } from '../utils/slideshowHelper';

const HomePage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>(); 
  const navigate = useNavigate();
  
  // State to track tags of the current visible slide in the slideshow
  const [activeImageTags, setActiveImageTags] = useState<string[]>([]);

  const filteredAndShuffledImages = useMemo(() => {
    // 1. Filter with case-insensitive check
    let result = tag 
      ? slideshowImages.filter(slide => 
          slide.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
        )
      : [...slideshowImages];

    // 2. Old School Fisher-Yates Shuffle
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, [tag]);

  const handleSelectTag = (newTag: string | null) => {
    if (newTag) {
      navigate(`/${newTag.toLowerCase()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#565656] min-h-screen w-full flex flex-col">
      <Slideshow 
        images={filteredAndShuffledImages} 
        onSlideChange={setActiveImageTags} 
      />
      
      <div className="bg-[#565656] w-full overflow-hidden">
        <WordCloud 
          images={slideshowImages} 
          selectedTag={tag || null} 
          activeImageTags={activeImageTags}
          onSelectTag={handleSelectTag} 
        />
      </div>
      
      <div className="bg-[#565656] w-full">
        <CompanyStatement />
      </div>
    </div>
  );
};

export default HomePage;