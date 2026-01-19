import React, { useState, useEffect, useCallback } from 'react';
import { shuffleArray, preloadImages } from '../utils/slideshowHelper';
import { Slide } from '../types';

interface SlideshowProps {
  images: Slide[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
  const [shuffledImages, setShuffledImages] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length > 0) {
      const newShuffled = shuffleArray(images);
      setShuffledImages(newShuffled);
      setCurrentIndex(0); 
      preloadImages(newShuffled);
    } else {
      setShuffledImages([]);
    }
  }, [images]);
  
  const nextSlide = useCallback(() => {
    if (shuffledImages.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
    }
  }, [shuffledImages.length]);

  const prevSlide = () => {
    if (shuffledImages.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + shuffledImages.length) % shuffledImages.length);
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); 
    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, nextSlide]);

  if (!shuffledImages || shuffledImages.length === 0) {
    return (
      <div className="aspect-video w-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
        No images found for this category.
      </div>
    );
  }
  
  const currentSlide = shuffledImages[currentIndex];
  const parts = currentSlide.caption ? currentSlide.caption.split(': ') : [''];
  const projectName = parts[0];
  const clientName = parts[1] || '';

  return (
    <div className="w-full">
      
      {/* SLIDESHOW WINDOW */}
      <div 
        className="relative w-full aspect-video overflow-hidden rounded-lg shadow-2xl bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <img
          key={currentSlide.url}
          src={currentSlide.url}
          alt={currentSlide.caption}
          className="absolute inset-0 w-full h-full object-cover animate-fade-in"
        />

        {/* OVERLAY CAPTION */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-3">
          {/* UPDATED: 
              - Removed 'font-bold'
              - Added strong custom drop-shadow
          */}
          <div className="text-sm text-gray-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {projectName}
            {clientName && (
              <span> | {clientName}</span>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100 sm:opacity-50 sm:hover:opacity-100"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100 sm:opacity-50 sm:hover:opacity-100"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default Slideshow;