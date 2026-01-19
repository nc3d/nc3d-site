import React, { useMemo } from 'react';
import { Slide } from '../types';

interface WordCloudProps {
  images: Slide[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const WordCloud: React.FC<WordCloudProps> = ({ images, selectedTag, onSelectTag }) => {
  
  const tagList = useMemo(() => {
    const counts: Record<string, number> = {};
    images.forEach(img => {
      if (img.tags) {
        img.tags.forEach(tag => {
          if (tag !== '3D') {
            counts[tag] = (counts[tag] || 0) + 1;
          }
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
          selectedTag === null 
            ? 'text-blue-400 font-bold' // Blue highlight, no underline
            : 'text-gray-300'
        }`}
      >
        All Projects
      </button>

      {/* Separator */}
      <span className="text-gray-400">|</span>

      {/* Tag List */}
      {tagList.map((tag, index) => (
        <React.Fragment key={tag}>
          <button
            onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
            className={`hover:text-white transition-colors ${
              selectedTag === tag 
                ? 'text-blue-400 font-bold' // Blue highlight, no underline
                : 'text-gray-300'
            }`}
          >
            {tag}
          </button>
          
          {index < tagList.length - 1 && (
            <span className="text-gray-400">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WordCloud;