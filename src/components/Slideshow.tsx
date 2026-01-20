import React, { useState, useEffect } from 'react';
import { Slide } from '../types';

interface SlideshowProps {
  images: Slide[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!images.length) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images, currentIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-white">
        No images found.
      </div>
    );
  }

  const safeIndex = currentIndex >= images.length ? 0 : currentIndex;
  const currentSlide = images[safeIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // Logic: Replaces ": " with "  |  " (two spaces on either side)
  // Uses .replaceAll to ensure it catches every instance in the caption field
  const formattedCaption = currentSlide.caption?.replaceAll(': ', '  |  ');

  return (
    <div className="w-full bg-[#565656] flex flex-col items-center">
      {/* 1. The 16:9 Image Window */}
      <div className="relative w-full max-w-screen-xl aspect-video overflow-hidden group bg-black">
        <div key={currentSlide.url} className="absolute inset-0 w-full h-full">
          <img 
            src={currentSlide.url} 
            alt={currentSlide.caption} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevSlide} 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 p-4 rounded-full text-white z-20 transition-opacity opacity-0 group-hover:opacity-100"
            >
              &#10094;
            </button>
            <button 
              onClick={nextSlide} 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 p-4 rounded-full text-white z-20 transition-opacity opacity-0 group-hover:opacity-100"
            >
              &#10095;
            </button>
          </>
        )}
      </div>

      {/* 2. Captions (Styled exactly like CompanyStatement.tsx) */}
      <div className="w-full max-w-screen-xl px-4 md:px-0">
        <div className="px-6 py-4 bg-[#606060] text-gray-300 text-base mt-4 text-left rounded-lg shadow-lg">
          {/* - line-clamp-3: Limits text height to 3 lines
            - text-base: Matches company statement font size
            - leading-relaxed: Matches site body copy spacing
          */}
          <p className="line-clamp-3 leading-relaxed">
            {formattedCaption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;