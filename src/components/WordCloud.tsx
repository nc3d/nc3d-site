import React, { useMemo } from 'react';
import { Slide } from '../types';

interface WordCloudProps {
  images: Slide[];
  selectedTag: string | null;
  activeImageTags: string[];
  onSelectTag: (tag: string | null) => void;
}

const WordCloud: React.FC<WordCloudProps> = ({ images, selectedTag, activeImageTags, onSelectTag }) => {
  
  const tagList = useMemo(() => {
    const counts: Record<string, number> = {};
    images.forEach(img => {
      if (img.tags) {
        img.tags.forEach(tag => {
          if (tag !== '3D') counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return Object.keys(counts).sort((a, b) => a.localeCompare(b));
  }, [images]);

  return (
    <div className="px-6 py-4 bg-[#606060] text-gray-300 text-sm mt-4 text-left rounded-lg shadow-lg flex flex-wrap gap-x-2 items-center leading-tight">
      
      {/* "All Projects" Button */}
      <button
        onClick={() => onSelectTag(null)}
        className={`hover:text-white transition-colors ${
          selectedTag === null ? 'text-blue-400 font-bold' : 'text-gray-400'
        }`}
      >
        All Projects
      </button>

      <span className="text-gray-500">|</span>

      {tagList.map((tag, index) => {
        const isCurrentFilter = selectedTag?.toLowerCase() === tag.toLowerCase();
        const isAssociatedWithImage = activeImageTags.some(t => t.toLowerCase() === tag.toLowerCase());

        return (
          <React.Fragment key={tag}>
            <button
              onClick={() => onSelectTag(isCurrentFilter ? null : tag)}
              className={`hover:text-white transition-colors duration-300 ${
                isCurrentFilter 
                  ? 'text-blue-400 font-bold' // Current Filter: Blue & Bold
                  : isAssociatedWithImage 
                    ? 'text-white'            // In current image: Pure White (No Bold)
                    : 'text-gray-400'         // Not in current image: Dim Gray
              }`}
            >
              {tag}
            </button>
            
            {index < tagList.length - 1 && (
              <span className="text-gray-500">|</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default WordCloud;