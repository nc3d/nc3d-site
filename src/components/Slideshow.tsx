import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { slideshowImages, shuffleArray, preloadImages } from '../utils/slideshowHelper';
import { Slide } from '../types';

const Slideshow: React.FC = () => {
  const shuffledImages = useMemo(() => shuffleArray(slideshowImages), []);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    preloadImages(shuffledImages);
  }, [shuffledImages]);
  
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
  }, [shuffledImages.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + shuffledImages.length) % shuffledImages.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, nextSlide]);

  if (!shuffledImages || shuffledImages.length === 0) {
    return <div className="aspect-video w-full bg-gray-700 rounded-lg shadow-2xl flex items-center justify-center text-gray-400">Loading slideshow...</div>;
  }
  
  const currentSlide = shuffledImages[currentIndex];
  const [projectName, clientName] = currentSlide.caption.split(': ');

  return (
    <div 
      className="relative w-full aspect-video overflow-hidden rounded-lg shadow-2xl bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* The key here makes React create a new element on change, which can re-trigger animations */}
      <img
        key={currentSlide.url}
        src={currentSlide.url}
        alt={currentSlide.caption}
        className="absolute inset-0 w-full h-full object-cover animate-fade-in"
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      {/* Slide info */}
      <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white w-full">
        <h2 className="text-base sm:text-lg">
          {projectName && <div>{projectName}</div>}
          {clientName && <div>{clientName}</div>}
        </h2>
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white opacity-50 hover:opacity-100"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white opacity-50 hover:opacity-100"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Slideshow;